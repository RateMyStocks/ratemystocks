import { Component, Inject, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ProductService } from '../../../../core/services/productservice';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
// import { AppMainComponent } from '../../../../app.main.component';
import { DOCUMENT } from '@angular/common';
import { MoneyFormatter } from '../../../../shared/utilities/money-formatter';
import * as moment from 'moment';
import * as _ from 'lodash';
import { IexCloudSecurityType, PortfolioDto, PortfolioRatingDto, PortfolioStockDto } from '@ratemystocks/api-interface';
import { Subject } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { IexCloudService } from '../../../../core/services/iex-cloud.service';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Meta, Title } from '@angular/platform-browser';
import { MarketCapThresholds } from '../../../../shared/models/enums/market-cap-thresholds';
import { MarketCap } from '../../../../shared/models/enums/market-cap';

@Component({
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit {
  MoneyFormatter = MoneyFormatter;

  moment = moment;

  Infinity = Infinity;

  portfolio: PortfolioDto;

  portfolioStocks: PortfolioStockDto[];

  portfolioRating: PortfolioRatingDto;

  selectedBreakdownCategory = 'company';
  pieChartItems: any[] = [];

  isAuth: boolean;
  loggedInUserId: string;
  numLikes = 0;
  numDislikes = 0;

  // Object representing the response from IEX Cloud API Batch requests (https://iexcloud.io/docs/api/#batch-requests)
  // Maps stock ticker symbols to corresponding data. Visit IEX Cloud API docs to see example JSON response.
  iexStockDataMap: { symbol: any };

  portfolioLoaded: boolean;
  stocksLoaded: boolean;

  portfolioStocksNewsItems: { ticker:[], url: string, image: string, headline: string}[] = [];

  portfolioLiked: boolean;

  portfolioBreakdownCategories = [
    { name: 'Company', code: 'company' },
    { name: 'Country', code: 'country' },
    { name: 'Market Cap', code: 'marketCap' },
    { name: 'Sector', code: 'sector' },
    { name: 'Security Type', code: 'securityType' },
  ];

  visitors = 0;
  visitCountsByDay!: any[];
  visitPercentChangeToday = 0;

  followers = 0;
  followerCountsByDay!: any[];
  followerPercentChangeToday = 0;
  noNewFollowers = false;
  isLoggedInUserFollowing = false;

  private ngUnsubscribe = new Subject();

  constructor(
    private authService: AuthService,
    private portfolioService: PortfolioService,
    private iexCloudService: IexCloudService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: AppBreadcrumbService,
    private confirmService: ConfirmationService,
    private meta: Meta,
    private title: Title,
    // private appMain: AppMainComponent,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.breadcrumbService.setItems([{ label: 'Home' }, { label: 'Portfolios', routerLink: ['/portfolios'] }]);
  }

  ngOnInit() {
    // Stock data pre-fetched from StockResolver
    this.portfolio = this.route.snapshot.data.portfolio;

    this.isAuth = this.authService.isAuthorized();

    // Check if the portfolio is already saved by the logged-in user
    if (this.isAuth) {
      this.userService
        .getSavedPortfoliosForUser()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((savedPortfolios: PortfolioDto[]) => {
          this.portfolioLiked =
            savedPortfolios.filter(function (savedPortfolio: PortfolioDto) {
              return savedPortfolio.id === this.portfolio.id;
            }).length > 0;
        });
    }

    this.loggedInUserId = this.authService.getUserId();
    this.authService
      .getAuthStatusListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isAuth: boolean) => {
        this.isAuth = isAuth;
        if (isAuth) {
          this.loggedInUserId = this.authService.getUserId();

          this.portfolioService.isFollowingPortfolio(this.portfolio.id).subscribe((isFollowingStock: boolean) => {
            this.isLoggedInUserFollowing = isFollowingStock;
          });
        }
      });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const portfolioId = paramMap.get('id');

      this.populateVisitCountsWidget(portfolioId);

      if (this.isAuth) {
        this.portfolioService
          .addPortfolioPageVisit(portfolioId, this.authService.getUserId())
          .subscribe((visitCount: number) => (this.visitors = visitCount));

        this.portfolioService
          .getTotalFollowerCounts(portfolioId)
          .subscribe((followerCount: number) => (this.followers = followerCount));

        this.portfolioService.isFollowingPortfolio(portfolioId).subscribe((isFollowingPortfolio: boolean) => {
          this.isLoggedInUserFollowing = isFollowingPortfolio;
        });
      } else {
        this.portfolioService
          .addPortfolioPageVisit(portfolioId)
          .subscribe((visitCount: number) => (this.visitors = visitCount));

        this.portfolioService
          .getTotalFollowerCounts(portfolioId)
          .subscribe((followerCount: number) => (this.followers = followerCount));
      }

      // Get the Portfolio's stocks
      this.portfolioService
        .getPortfolioStocks(portfolioId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((stocks: PortfolioStockDto[]) => {
          this.portfolioStocks = stocks;

          this.stocksLoaded = true;

          if (stocks.length > 0) {
            this.updateIexStockDataMap();
          }

          this.setStockPieChartBreakdown();

          this.setStockNews();
        });

      // Get the Portfolio's ratings
      this.portfolioService
        .getPortfolioRatingCounts(portfolioId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((ratings: { likes: number; dislikes: number }) => {
          this.numLikes = ratings.likes;
          this.numDislikes = ratings.dislikes;
        });

      // Set the user's portfolio rating if they are logged-in.
      if (this.isAuth) {
        this.portfolioService
          .getPortfolioUserRating(portfolioId)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((rating: PortfolioRatingDto) => {
            this.portfolioRating = rating;
          });
      }
    });
  }

  /**
   * Calls IEX Cloud API and updates the iexStockDataMap variable that maps ticker symbols to stock data
   */
  updateIexStockDataMap(): void {
    const tickerSymbols: string[] = this.portfolioStocks.map((stock: PortfolioStockDto) => stock.ticker);
    this.iexCloudService
      .batchGetStocks(tickerSymbols, ['stats', 'company', 'price'])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: any) => {
        this.iexStockDataMap = result;
      });
  }

  /**
   * Updates the items that will be displayed in the NGX Pie Chart to show the stock weightings.
   * Shows the top 10 largest holdings with an additional 'Other' category representing all the
   * remaining holdings of the portfolio.
   */
  private setStockPieChartBreakdown(): void {
    let topFiveWeighting = 0;

    this.pieChartItems = _.sortBy(this.portfolioStocks, 'weighting')
      .reverse()
      .slice(0, 5)
      .map((stock: PortfolioStockDto) => {
        topFiveWeighting += stock.weighting;
        return { name: stock.ticker, value: stock.weighting.toFixed(2) };
      });

    if (this.portfolioStocks.length > 5) {
      const otherWeighting = 100 - topFiveWeighting;
      this.pieChartItems.push({ name: 'Other', value: otherWeighting });
    }
  }

  /**
   * Gets the "category" from the  dropdown that will be used to update the
   * Pie chart that displays the portfolio breakdowns.
   * @param event The MatSelectChange event that is triggered from the MatSelect dropdown for the Pie chart.
   */
  setPieChartItems(event): void {
    const selectedValue: { name: string; code: string } = event.value;

    switch (selectedValue.code) {
      case 'company':
        this.setStockPieChartBreakdown();
        break;
      case 'country':
        this.setPieChartBreakdownByIexField('country');
        break;
      case 'marketCap':
        this.setMarketCapBreakdown();
        break;
      case 'sector':
        this.setPieChartBreakdownByIexField('sector');
        break;
      case 'securityType':
        this.setPieChartBreakdownByIexField('issueType');
        break;
    }
  }

  /**
   * Update the items that will be set on the NGX Pie Chart to show the breakdown by some IEX Cloud API field.
   * i.e. Getting the portfolio breakdown based on the country, sector, etc. that the stocks belong to.
   * {@link https://iexcloud.io/docs/api/#company IEX Cloud API Documentation - Company Endpoint}.
   * @param iexCloudField The name of the company property/field to extract the value of for a given stock
   */
  private setPieChartBreakdownByIexField(iexCloudField: string): void {
    // Map of IEX company values (i.e. the sector or country of a stock) mapped to aggregated portfolio weightings.
    const categoryWeightingMap: Map<string, number> = new Map();

    this.portfolioStocks.map((stock: PortfolioStockDto): void => {
      const iexStockMapping = this.iexStockDataMap[stock.ticker];
      const iexCloudValue = iexStockMapping.company[iexCloudField];

      if (iexCloudValue) {
        const value = iexCloudField === 'issueType' ? IexCloudSecurityType[iexCloudValue] : iexCloudValue;
        categoryWeightingMap.set(
          value,
          categoryWeightingMap.has(value) ? categoryWeightingMap.get(value) + stock.weighting : stock.weighting
        );
      } else {
        categoryWeightingMap.set(
          'Other',
          categoryWeightingMap.has('Other') ? categoryWeightingMap.get('Other') + stock.weighting : stock.weighting
        );
      }
    });

    this.pieChartItems = [];
    for (const [key, value] of categoryWeightingMap) {
      this.pieChartItems.push({ name: key, value });
    }
  }

  /**
   * Update the items that will be set on the NGX Pie Chart to show the breakdown by market cap.
   * {@link https://iexcloud.io/docs/api/#key-stats IEX Cloud API Documentation - Stats Endpoint}.
   */
  private setMarketCapBreakdown(): void {
    let megaCapWeighting = 0;
    let largeCapWeighting = 0;
    let midCapWeighting = 0;
    let smallCapWeighting = 0;
    let microCapWeighting = 0;

    this.portfolioStocks.map((stock: PortfolioStockDto): void => {
      const marketCapValue = this.iexStockDataMap[stock.ticker]?.stats?.marketcap;

      if (marketCapValue >= MarketCapThresholds.MegaCap) {
        megaCapWeighting += stock.weighting;
      } else if (marketCapValue < MarketCapThresholds.MegaCap && marketCapValue >= MarketCapThresholds.LargeCap) {
        largeCapWeighting += stock.weighting;
      } else if (marketCapValue < MarketCapThresholds.LargeCap && marketCapValue >= MarketCapThresholds.MidCap) {
        midCapWeighting += stock.weighting;
      } else if (marketCapValue < MarketCapThresholds.MidCap && marketCapValue >= MarketCapThresholds.SmallCap) {
        smallCapWeighting += stock.weighting;
      } else if (marketCapValue < MarketCapThresholds.SmallCap && marketCapValue >= MarketCapThresholds.MicroCap) {
        microCapWeighting += stock.weighting;
      }
    });

    this.pieChartItems = [
      { name: MarketCap.MegaCap, value: megaCapWeighting },
      { name: MarketCap.LargeCap, value: largeCapWeighting },
      { name: MarketCap.MidCap, value: midCapWeighting },
      { name: MarketCap.SmallCap, value: smallCapWeighting },
      { name: MarketCap.MicroCap, value: microCapWeighting },
    ];
  }

  /**
   * Gets the largest holding of the portfolio based on weighting.
   * @return Ticker symbol of the stock with the highest weighting in the portfolio
   */
  getLargestHolding(): string {
    return this.portfolioStocks.length
      ? this.portfolioStocks.sort((a: PortfolioStockDto, b: PortfolioStockDto) =>
          b.weighting > a.weighting ? 1 : -1
        )[0].ticker
      : '';
  }

  /**
   * Calculates the total weighting of the top 10 largest holdings of the portfolio.
   * @returns The top 10 total weighting of the portfolio holdings.
   */
  calculateTopTenTotalWeighting(): number {
    return this.portfolioStocks.length
      ? _.sortBy(this.portfolioStocks, 'weighting')
          .reverse()
          .slice(0, 10)
          .map((stock: PortfolioStockDto) => stock.weighting)
          .reduce((acc: number, currentValue: number) => acc + currentValue)
      : 0;
  }

  /**
   * Gets the most commonly occurring value within the portfolio by some IEX Cloud API "Company" field.
   * i.e. most common sector, most common country, etc.
   * {@link https://iexcloud.io/docs/api/#company IEX Cloud API Documentation - Company Endpoint}.
   * @param iexCompanyField The name of the company property/field to extract the value of for a given stock
   */
  getHighestWeightedIexCloudValue(iexCompanyField: string): string {
    // Map of IEX company values (i.e. the sector or country of a stock) mapped to aggregated portfolio weightings.
    const valueWeightingMap: Map<string, number> = new Map();

    // Iterate through the portfolio's stocks to push data into the valueWeightingMap
    this.portfolioStocks.forEach((stock: PortfolioStockDto): void => {
      const iexStockMapping = this.iexStockDataMap[stock.ticker];
      const iexCloudValue = iexStockMapping ? iexStockMapping.company[iexCompanyField] : null;

      if (iexCloudValue) {
        valueWeightingMap.set(
          iexCloudValue,
          valueWeightingMap.has(iexCloudValue)
            ? valueWeightingMap.get(iexCloudValue) + stock.weighting
            : stock.weighting
        );
      }
    });

    return valueWeightingMap.size
      ? Array.from(valueWeightingMap, ([name, value]: [string, number]) => ({
          name,
          value,
        })).reduce((prev: { name: string; value: number }, current: { name: string; value: number }) =>
          prev.value > current.value ? prev : current
        ).name
      : '';
  }

  /**
   * Calculates the weighted average IEX Cloud stat for the portfolio.
   * {@link https://iexcloud.io/docs/api/ IEX Cloud API Docs}.
   * @param iexCloudField The field from the IEX Cloud API 'Key Stats' endpoint
   * @return The asset-weighted average of some stat (i.e. market cap, div yield, etc.) of the portfolio.
   */
  calculateWeightedAvg(iexCloudField: string): number {
    let total = 0;

    this.portfolioStocks.forEach((stock: PortfolioStockDto) => {
      const iexStockMapping = this.iexStockDataMap[stock.ticker];
      if (iexStockMapping) {
        total += iexStockMapping.stats[iexCloudField] * (stock.weighting / 100);
      }
    });

    return total;
  }

  /**
   * Used to populate the page visits widget showing the number of page visits per day as bars.
   * Sets an array of objects containing number of visits per day and the height in pixels the bar for that day should be.
   */
  populateVisitCountsWidget(portfolioId: string): void {
    // The max number of pixels the highest "bar" in the visits chart should be.
    const maxHeightPixels = 52;

    this.portfolioService.getPortfolioVisitCounts(portfolioId).subscribe((counts: { visit_count: number }[]) => {
      const highestCount = counts
        .map((countObj: any) => countObj.visit_count)
        .reduce((prev, curr) => (prev > curr ? prev : curr));

      this.visitCountsByDay = counts.map((countObj: any) => {
        const dayCount = countObj.visit_count;
        const fractionOfHighestCount = highestCount > 0 ? dayCount / highestCount : 0;
        const pixelCount = maxHeightPixels * fractionOfHighestCount;
        return { visitCount: dayCount, pixelCount: pixelCount > 0 ? pixelCount.toString() + 'px' : '0.1px' };
      });

      console.log('VISIT COUNTS BY DAY', this.visitCountsByDay);

      this.visitPercentChangeToday =
        ((counts[counts.length - 1].visit_count - counts[counts.length - 2].visit_count) /
          counts[counts.length - 2].visit_count) *
        100;
    });
  }

  /**
   * Event handler for clicking the Follow button. Calls the backend to add the logged-in user
   * as a follower to the stock.
   */
  followPortfolio(): void {
    if (this.isAuth) {
      this.portfolioService.followPortfolio(this.portfolio.id).subscribe(() => {
        this.isLoggedInUserFollowing = true;

        this.portfolioService
          .getTotalFollowerCounts(this.portfolio.id)
          .subscribe((followerCount: number) => (this.followers = followerCount));
        this.populateFollowerCountsWidget(this.portfolio.id);
      });
    } else {
      this.confirmService.confirm({
        target: event.target,
        message: 'You must be logged-in to follow this portfolio. Would you like to login?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.router.navigate(['/login']);
        },
        reject: () => {
          //reject action
        },
      });
    }
  }

  /**
   * Event handler for clicking the unfollow button on the portfolio page. Calls the backend to remove the logged-in user
   * as a follower of the stock.
   */
  unfollowPortfolio(): void {
    if (this.isAuth) {
      this.portfolioService.unfollowPortfolio(this.portfolio.id).subscribe(() => {
        this.isLoggedInUserFollowing = false;

        this.portfolioService
          .getTotalFollowerCounts(this.portfolio.id)
          .subscribe((followerCount: number) => (this.followers = followerCount));
        this.populateFollowerCountsWidget(this.portfolio.id);
      });
    }
  }

  populateFollowerCountsWidget(ticker: string): void {
    // The max number of pixels the highest "bar" in the followers chart should be.
    const maxHeightPixels = 52;
    this.portfolioService.getFollowerCountsLastNDays(ticker).subscribe((counts: { follower_count: number }[]) => {
      const highestCount = counts
        .map((countObj: any) => countObj.follower_count)
        .reduce((prev, curr) => (prev > curr ? prev : curr));

      this.followerCountsByDay = counts.map((countObj: any) => {
        const dayCount = countObj.follower_count;
        const fractionOfHighestCount = highestCount > 0 ? dayCount / highestCount : 0;
        const pixelCount = maxHeightPixels * fractionOfHighestCount;
        return { followerCount: dayCount, pixelCount: pixelCount > 0 ? pixelCount.toString() + 'px' : '0.1px' };
      });

      const currentDayFollowerCount = counts[counts.length - 1].follower_count;
      const previousDayFollowerCount = counts[counts.length - 2].follower_count;

      this.followerPercentChangeToday =
        previousDayFollowerCount > 0
          ? ((currentDayFollowerCount - previousDayFollowerCount) / previousDayFollowerCount) * 100
          : 0;

      this.noNewFollowers = counts.map((countObj: any) => countObj.follower_count).every((num) => num === 0);
    });
  }

  /**
   * Sets the aggregated list of news article for the stocks of the portfolio.
   */
  setStockNews(): void {
    const top10HoldingsTickers = this.portfolioStocks.length
      ? this.portfolioStocks
          .sort((a: PortfolioStockDto, b: PortfolioStockDto) => (b.weighting > a.weighting ? 1 : -1))
          .slice(0, 29)
          .map((p) => p.ticker)
      : [];

    this.iexCloudService.batchGetStocks(top10HoldingsTickers, ['news']).subscribe((tickerToNewsMap: { [ticker: string]: { news: [{ headline: string, url: string, image: string, datetime: string, source: string }]} }) => {
      const portfolioStocksNews = [];
      for (const [key, value] of Object.entries(tickerToNewsMap)) {
        value.news.forEach(article => {
          if (portfolioStocksNews.some(e => e.headline === article.headline)) {
            const stockNews = portfolioStocksNews.find(stock => {
              return stock.headline === article.headline;
            });

            stockNews['tickers'].push(key);
          } else {
            portfolioStocksNews.push({ tickers: [key], ...article});
          }
        })
      }

      this.portfolioStocksNewsItems = portfolioStocksNews.sort((a, b) => {
        return b.datetime > a.datetime ? 1 : -1;
      });
    });
  }
}

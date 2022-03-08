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

  portfolioStocksNewsItems = [];

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
    // const top30Holdings = this.portfolioStocks.length
    //   ? this.portfolioStocks
    //       .sort((a: PortfolioStockDto, b: PortfolioStockDto) => (b.weighting > a.weighting ? 1 : -1))
    //       .slice(0, 29)
    //       .map((p) => p.ticker)
    //   : [];

    const tickers = this.portfolioStocks.map((p) => p.ticker);

    // this.iexCloudService.batchGetStocks(tickers, ['news']).subscribe((tickerToNewsMap) => {
    //   const portfolioStocksNews = [];
    //   for (const [key, value] of Object.entries(tickerToNewsMap)) {
    //     // For each of the top 10 stocks, add the latest news article for each stock to the portfolio's news feed.
    //     portfolioStocksNews.push({ ticker: key, ...tickerToNewsMap[key].news[0] });

    //     console.log(tickerToNewsMap);

    //     this.portfolioStocksNewsItems = portfolioStocksNews.sort((a, b) => {
    //       return b.datetime > a.datetime ? 1 : -1;
    //     });
    //   }
    // });

    this.iexCloudService.batchGetStocks(tickers, ['news']).subscribe((tickerToNewsMap) => {
      const portfolioStocksNews = [];
      for (const [key, value] of Object.entries(tickerToNewsMap)) {
        // For each of the top 10 stocks, add the latest news article for each stock to the portfolio's news feed.
        // portfolioStocksNews.push({ ticker: key, ...tickerToNewsMap[key].news[0] });
        portfolioStocksNews.push(...value['news']);

        this.portfolioStocksNewsItems = portfolioStocksNews.sort((a, b) => {
          return b.datetime > a.datetime ? 1 : -1;
        });
      }
    });
  }
}

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { ActivatedRoute, ParamMap, Router } from '@angular/router';
// import * as moment from 'moment';
// import * as _ from 'lodash';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatSelectChange } from '@angular/material/select';
// import { MatDialog } from '@angular/material/dialog';
// import { UpdatePortfolioNameDialogComponent } from '../../components/update-portfolio-name-dialog/update-portfolio-name-dialog.component';
// import { UpdatePortfolioDescriptionDialogComponent } from '../../components/update-portfolio-description-dialog/update-portfolio-description-dialog.component';
// import { MoneyFormatter } from '../../../../shared/utilities/money-formatter';
// import {
//   CreatePortfolioRatingDto,
//   PortfolioDto,
//   PortfolioRatingDto,
//   PortfolioStockDto,
//   IexCloudSecurityType,
// } from '@ratemystocks/api-interface';
// import { PortfolioService } from '../../../../core/services/portfolio.service';
// import { IexCloudService } from '../../../../core/services/iex-cloud.service';
// import { MarketCapThresholds } from '../../../../shared/models/enums/market-cap-thresholds';
// import { MarketCap } from '../../../../shared/models/enums/market-cap';
// import { AuthService } from '../../../../core/services/auth.service';
// import { Subject } from 'rxjs';
// import { UpdatePortfolioHoldingsDialogComponent } from '../../components/update-portfolio-holdings-dialog/update-portfolio-holdings-dialog.component';
// import { UserService } from '../../../../core/services/user.service';
// import { takeUntil } from 'rxjs/operators';

// @Component({
//   selector: 'app-portfolio',
//   templateUrl: './portfolio.component.html',
//   styleUrls: ['./portfolio.component.scss'],
// })
// export class PortfolioComponent implements OnInit, OnDestroy {
//   MoneyFormatter = MoneyFormatter;

//   moment = moment;

//   portfolio: PortfolioDto;

//   portfolioStocks: PortfolioStockDto[];

//   portfolioRating: PortfolioRatingDto;

//   selectedBreakdownCategory = 'company';
//   pieChartItems: any[] = [];

//   isAuth: boolean;
//   loggedInUserId: string;
//   numLikes = 0;
//   numDislikes = 0;

//   // Object representing the response from IEX Cloud API Batch requests (https://iexcloud.io/docs/api/#batch-requests)
//   // Maps stock ticker symbols to corresponding data. Visit IEX Cloud API docs to see example JSON response.
//   iexStockDataMap: { symbol: any };

//   portfolioLoaded: boolean;
//   stocksLoaded: boolean;

//   portfolioLiked: boolean;

//   copiedPortfolioLink: string = window.location.href;

//   private ngUnsubscribe = new Subject();

//   constructor(
//     private authService: AuthService,
//     private portfolioService: PortfolioService,
//     private iexCloudService: IexCloudService,
//     private userService: UserService,
//     private snackbar: MatSnackBar,
//     private route: ActivatedRoute,
//     private router: Router,
//     public dialog: MatDialog
//   ) {
//     this.isAuth = this.authService.isAuthorized();
//   }

//   ngOnInit(): void {
//     this.loggedInUserId = this.authService.getUserId();
//     this.authService
//       .getAuthStatusListener()
//       .pipe(takeUntil(this.ngUnsubscribe))
//       .subscribe((authStatus: boolean) => {
//         if (this.authService.isAuthorized()) {
//           this.loggedInUserId = this.authService.getUserId();
//         }
//       });

//     this.route.paramMap.subscribe((paramMap: ParamMap) => {
//       const portfolioId = paramMap.get('id');

//       // Get the Portfolio
//       this.portfolioService
//         .getPortfolio(portfolioId)
//         .pipe(takeUntil(this.ngUnsubscribe))
//         .subscribe(
//           (portfolio: PortfolioDto) => {
//             this.portfolio = portfolio;

//             this.portfolioLoaded = true;

//             // Check if the portfolio is already saved by the logged-in user
//             if (this.isAuth) {
//               this.userService
//                 .getSavedPortfoliosForUser()
//                 .pipe(takeUntil(this.ngUnsubscribe))
//                 .subscribe((savedPortfolios: PortfolioDto[]) => {
//                   this.portfolioLiked =
//                     savedPortfolios.filter(function (savedPortfolio: PortfolioDto) {
//                       return savedPortfolio.id === portfolio.id;
//                     }).length > 0;
//                 });
//             }
//           },
//           (error: any) => {
//             this.router.navigate(['not-found']);
//           }
//         );

//       // Get the Portfolio's stocks
//       this.portfolioService
//         .getPortfolioStocks(portfolioId)
//         .pipe(takeUntil(this.ngUnsubscribe))
//         .subscribe((stocks: PortfolioStockDto[]) => {
//           this.portfolioStocks = stocks;

//           this.stocksLoaded = true;

//           if (stocks.length > 0) {
//             this.updateIexStockDataMap();
//           }

//           this.setStockPieChartBreakdown();
//         });

//       // Get the Portfolio's ratings
//       this.portfolioService
//         .getPortfolioRatingCounts(portfolioId)
//         .pipe(takeUntil(this.ngUnsubscribe))
//         .subscribe((ratings: { likes: number; dislikes: number }) => {
//           this.numLikes = ratings.likes;
//           this.numDislikes = ratings.dislikes;
//         });

//       // Set the user's portfolio rating if they are logged-in.
//       if (this.isAuth) {
//         this.portfolioService
//           .getPortfolioUserRating(portfolioId)
//           .pipe(takeUntil(this.ngUnsubscribe))
//           .subscribe((rating: PortfolioRatingDto) => {
//             this.portfolioRating = rating;
//           });
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     this.ngUnsubscribe.next();
//     this.ngUnsubscribe.complete();
//   }

//   /**
//    * Calculates the total weighting of the top 10 largest holdings of the portfolio.
//    * @returns The top 10 total weighting of the portfolio holdings.
//    */
//   calculateTopTenTotalWeighting(): number {
//     return this.portfolioStocks.length
//       ? _.sortBy(this.portfolioStocks, 'weighting')
//           .reverse()
//           .slice(0, 10)
//           .map((stock: PortfolioStockDto) => stock.weighting)
//           .reduce((acc: number, currentValue: number) => acc + currentValue)
//       : 0;
//   }

//   /**
//    * Calculates the weighted average IEX Cloud stat for the portfolio.
//    * {@link https://iexcloud.io/docs/api/ IEX Cloud API Docs}.
//    * @param iexCloudField The field from the IEX Cloud API 'Key Stats' endpoint
//    * @return The asset-weighted average of some stat (i.e. market cap, div yield, etc.) of the portfolio.
//    */
//   calculateWeightedAvg(iexCloudField: string): number {
//     let total = 0;

//     this.portfolioStocks.forEach((stock: PortfolioStockDto) => {
//       const iexStockMapping = this.iexStockDataMap[stock.ticker];
//       if (iexStockMapping) {
//         total += iexStockMapping.stats[iexCloudField] * (stock.weighting / 100);
//       }
//     });

//     return total;
//   }

//   /**
//    * Gets the most commonly occurring value within the portfolio by some IEX Cloud API "Company" field.
//    * i.e. most common sector, most common country, etc.
//    * {@link https://iexcloud.io/docs/api/#company IEX Cloud API Documentation - Company Endpoint}.
//    * @param iexCompanyField The name of the company property/field to extract the value of for a given stock
//    */
//   getHighestWeightedIexCloudValue(iexCompanyField: string): string {
//     // Map of IEX company values (i.e. the sector or country of a stock) mapped to aggregated portfolio weightings.
//     const valueWeightingMap: Map<string, number> = new Map();

//     // Iterate through the portfolio's stocks to push data into the valueWeightingMap
//     this.portfolioStocks.forEach((stock: PortfolioStockDto): void => {
//       const iexStockMapping = this.iexStockDataMap[stock.ticker];
//       const iexCloudValue = iexStockMapping ? iexStockMapping.company[iexCompanyField] : null;

//       if (iexCloudValue) {
//         valueWeightingMap.set(
//           iexCloudValue,
//           valueWeightingMap.has(iexCloudValue)
//             ? valueWeightingMap.get(iexCloudValue) + stock.weighting
//             : stock.weighting
//         );
//       }
//     });

//     return valueWeightingMap.size
//       ? Array.from(valueWeightingMap, ([name, value]: [string, number]) => ({
//           name,
//           value,
//         })).reduce((prev: { name: string; value: number }, current: { name: string; value: number }) =>
//           prev.value > current.value ? prev : current
//         ).name
//       : '';
//   }

//   /**
//    * Gets the largest holding of the portfolio based on weighting.
//    * @return Ticker symbol of the stock with the highest weighting in the portfolio
//    */
//   getLargestHolding(): string {
//     return this.portfolioStocks.length
//       ? this.portfolioStocks.sort((a: PortfolioStockDto, b: PortfolioStockDto) =>
//           b.weighting > a.weighting ? 1 : -1
//         )[0].ticker
//       : '';
//   }

//   /**
//    * Gets the "category" from the mat-select dropdown that will be used to update the
//    * NGX Pie chart that displays the portfolio breakdowns.
//    * @param event The MatSelectChange event that is triggered from the MatSelect dropdown for the Pie chart.
//    */
//   setPieChartItems(event: MatSelectChange): void {
//     const selectedValue: string = event.value;

//     switch (selectedValue) {
//       case 'company':
//         this.setStockPieChartBreakdown();
//         break;
//       case 'country':
//         this.setPieChartBreakdownByIexField('country');
//         break;
//       case 'marketCap':
//         this.setMarketCapBreakdown();
//         break;
//       case 'sector':
//         this.setPieChartBreakdownByIexField('sector');
//         break;
//       case 'securityType':
//         this.setPieChartBreakdownByIexField('issueType');
//         break;
//     }
//   }

//   /**
//    * Updates the items that will be displayed in the NGX Pie Chart to show the stock weightings.
//    * Shows the top 10 largest holdings with an additional 'Other' category representing all the
//    * remaining holdings of the portfolio.
//    */
//   private setStockPieChartBreakdown(): void {
//     let topTenWeighting = 0;

//     this.pieChartItems = _.sortBy(this.portfolioStocks, 'weighting')
//       .reverse()
//       .slice(0, 10)
//       .map((stock: PortfolioStockDto) => {
//         topTenWeighting += stock.weighting;
//         return { name: stock.ticker, value: stock.weighting.toFixed(2) };
//       });

//     if (this.portfolioStocks.length > 10) {
//       const otherWeighting = 100 - topTenWeighting;
//       this.pieChartItems.push({ name: 'Other', value: otherWeighting });
//     }
//   }

//   /**
//    * Update the items that will be set on the NGX Pie Chart to show the breakdown by some IEX Cloud API field.
//    * i.e. Getting the portfolio breakdown based on the country, sector, etc. that the stocks belong to.
//    * {@link https://iexcloud.io/docs/api/#company IEX Cloud API Documentation - Company Endpoint}.
//    * @param iexCloudField The name of the company property/field to extract the value of for a given stock
//    */
//   private setPieChartBreakdownByIexField(iexCloudField: string): void {
//     // Map of IEX company values (i.e. the sector or country of a stock) mapped to aggregated portfolio weightings.
//     const categoryWeightingMap: Map<string, number> = new Map();

//     this.portfolioStocks.map((stock: PortfolioStockDto): void => {
//       const iexStockMapping = this.iexStockDataMap[stock.ticker];
//       const iexCloudValue = iexStockMapping.company[iexCloudField];

//       if (iexCloudValue) {
//         const value = iexCloudField === 'issueType' ? IexCloudSecurityType[iexCloudValue] : iexCloudValue;
//         categoryWeightingMap.set(
//           value,
//           categoryWeightingMap.has(value) ? categoryWeightingMap.get(value) + stock.weighting : stock.weighting
//         );
//       } else {
//         categoryWeightingMap.set(
//           'Other',
//           categoryWeightingMap.has('Other') ? categoryWeightingMap.get('Other') + stock.weighting : stock.weighting
//         );
//       }
//     });

//     this.pieChartItems = [];
//     for (const [key, value] of categoryWeightingMap) {
//       this.pieChartItems.push({ name: key, value });
//     }
//   }

//   /**
//    * Update the items that will be set on the NGX Pie Chart to show the breakdown by market cap.
//    * {@link https://iexcloud.io/docs/api/#key-stats IEX Cloud API Documentation - Stats Endpoint}.
//    */
//   private setMarketCapBreakdown(): void {
//     let megaCapWeighting = 0;
//     let largeCapWeighting = 0;
//     let midCapWeighting = 0;
//     let smallCapWeighting = 0;
//     let microCapWeighting = 0;

//     this.portfolioStocks.map((stock: PortfolioStockDto): void => {
//       const marketCapValue = this.iexStockDataMap[stock.ticker]?.stats?.marketcap;

//       if (marketCapValue >= MarketCapThresholds.MegaCap) {
//         megaCapWeighting += stock.weighting;
//       } else if (marketCapValue < MarketCapThresholds.MegaCap && marketCapValue >= MarketCapThresholds.LargeCap) {
//         largeCapWeighting += stock.weighting;
//       } else if (marketCapValue < MarketCapThresholds.LargeCap && marketCapValue >= MarketCapThresholds.MidCap) {
//         midCapWeighting += stock.weighting;
//       } else if (marketCapValue < MarketCapThresholds.MidCap && marketCapValue >= MarketCapThresholds.SmallCap) {
//         smallCapWeighting += stock.weighting;
//       } else if (marketCapValue < MarketCapThresholds.SmallCap && marketCapValue >= MarketCapThresholds.MicroCap) {
//         microCapWeighting += stock.weighting;
//       }
//     });

//     this.pieChartItems = [
//       { name: MarketCap.MegaCap, value: megaCapWeighting },
//       { name: MarketCap.LargeCap, value: largeCapWeighting },
//       { name: MarketCap.MidCap, value: midCapWeighting },
//       { name: MarketCap.SmallCap, value: smallCapWeighting },
//       { name: MarketCap.MicroCap, value: microCapWeighting },
//     ];
//   }

//   /**
//    * Click handler function for the like & dislike buttons of the Portfolio. Calls the portfolio service
//    * to create, update, or delete a user rating for the portfolio.
//    * NOTE: visually, when the like button is pressed, it is okay that it is not in sync with the database
//    * When the page is loaded/refreshed, that value will be correct. We just want make sure the number is incremented
//    * only by 1 so it is not confusing to the user.
//    * @param isLiked True if the "Like" button is clicked, false if the "Dislike" button is clicked
//    */
//   onRatePortfolio(isLiked: boolean): void {
//     if (this.isAuth) {
//       const portfolioRatingDto: CreatePortfolioRatingDto = {
//         id: this.portfolioRating && this.portfolioRating.id ? this.portfolioRating.id : undefined,
//         isLiked,
//       };

//       // Rating Exists
//       if (this.portfolioRating) {
//         // Existing rating is a like
//         if (this.portfolioRating.isLiked) {
//           // DELETE Like Rating
//           this.portfolioService
//             .deletePortfolioRating(this.portfolioRating.id)
//             .pipe(takeUntil(this.ngUnsubscribe))
//             .subscribe((result: void) => {
//               this.numLikes--;
//               this.portfolioRating = null;

//               // User clicked dislike
//               if (!isLiked) {
//                 // CREATE Dislike Rating
//                 this.portfolioService
//                   .createOrUpdatePortfolioRating(this.portfolio.id, portfolioRatingDto)
//                   .pipe(takeUntil(this.ngUnsubscribe))
//                   .subscribe((rating: PortfolioRatingDto) => {
//                     this.numDislikes++;
//                     this.portfolioRating = rating;
//                   });
//               }
//             });
//         } else {
//           // DELETE Dislike Rating
//           this.portfolioService
//             .deletePortfolioRating(this.portfolioRating.id)
//             .pipe(takeUntil(this.ngUnsubscribe))
//             .subscribe((result: void) => {
//               this.numDislikes--;
//               this.portfolioRating = null;

//               // User clicked like
//               if (isLiked) {
//                 // CREATE Like Rating
//                 this.portfolioService
//                   .createOrUpdatePortfolioRating(this.portfolio.id, portfolioRatingDto)
//                   .pipe(takeUntil(this.ngUnsubscribe))
//                   .subscribe((rating: PortfolioRatingDto) => {
//                     this.numLikes++;
//                     this.portfolioRating = rating;
//                   });
//               }
//             });
//         }
//       } else {
//         this.portfolioService
//           .createOrUpdatePortfolioRating(this.portfolio.id, portfolioRatingDto)
//           .pipe(takeUntil(this.ngUnsubscribe))
//           .subscribe((rating: PortfolioRatingDto) => {
//             if (isLiked) {
//               this.numLikes++;
//             } else {
//               this.numDislikes++;
//             }

//             this.portfolioRating = rating;
//           });
//       }
//     } else {
//       this.snackbar.open('You must login to rate portfolios.', 'OK', {
//         duration: 3000,
//         panelClass: 'warn-snackbar',
//       });
//     }
//   }

//   /**
//    * Social media icon click event handler to share the portfolio link to the corresponding site.
//    * NOTE: When redirecting from localhost, some social media sites will block the request.
//    * @param socialMediaUrl The URL of the social media site that the portfolio will be shared on.
//    */
//   shareOnSocialMedia(socialMediaUrl: string): void {
//     window.open(socialMediaUrl + window.location.href, '_blank');
//   }

//   /** The click handler for the cdkCopyToClipboard directive shows a message when the link is copied. */
//   onCopyPageLink(): void {
//     this.snackbar.open('Portfolio link copied to clipboard.', 'OK', {
//       duration: 3000,
//       panelClass: 'success-snackbar',
//       verticalPosition: 'top',
//       horizontalPosition: 'right',
//     });
//   }

//   /** Opens a MatDialog with a field to edit the portfolio name */
//   openEditPortfolioNameDialog(): void {
//     if (this.authService.isAuthorized()) {
//       const dialogRef = this.dialog.open(UpdatePortfolioNameDialogComponent, {
//         data: {
//           portfolio: this.portfolio,
//         },
//       });
//       dialogRef.afterClosed().subscribe((result: PortfolioDto) => {
//         if (result) {
//           this.portfolio = result;
//         }
//       });
//     }
//   }

//   /** Opens a MatDialog with a field to edit the portfolio description */
//   openEditPortfolioDescriptionDialog(): void {
//     if (this.authService.isAuthorized()) {
//       const dialogRef = this.dialog.open(UpdatePortfolioDescriptionDialogComponent, {
//         data: {
//           portfolio: this.portfolio,
//         },
//       });
//       dialogRef.afterClosed().subscribe((result: PortfolioDto) => {
//         if (result) {
//           this.portfolio = result;
//         }
//       });
//     }
//   }

//   /** Opens the MatDialog for updating portfolio holdings */
//   onClickEditPortfolioHoldings(): void {
//     if (this.authService.isAuthorized()) {
//       const dialogRef = this.dialog.open(UpdatePortfolioHoldingsDialogComponent, {
//         data: {
//           portfolio: this.portfolio,
//           portfolioStocks: this.portfolioStocks,
//         },
//       });
//       dialogRef.afterClosed().subscribe((result: PortfolioDto) => {
//         if (result) {
//           this.portfolio = result;

//           this.portfolioStocks = result.stocks;
//           this.setStockPieChartBreakdown();

//           if (this.portfolioStocks.length > 0) {
//             this.updateIexStockDataMap();
//           }
//         }
//       });
//     }
//   }

//   /** Event handler for clicking the "Save" button. Makes a request to saves the portfolio for a logged-in user. */
//   onClickSavePortfolio(): void {
//     if (this.isAuth) {
//       if (!this.portfolioLiked) {
//         this.userService
//           .savePortfolioToUserAccount(this.portfolio.id)
//           .pipe(takeUntil(this.ngUnsubscribe))
//           .subscribe(() => {
//             this.portfolioLiked = true;
//           });
//       } else {
//         this.userService
//           .unsavePortfolioFromUserAccount(this.portfolio.id)
//           .pipe(takeUntil(this.ngUnsubscribe))
//           .subscribe(() => {
//             this.portfolioLiked = false;
//           });
//       }
//     } else {
//       this.snackbar.open('You must login to save portfolios.', 'OK', {
//         duration: 3000,
//         panelClass: 'warn-snackbar',
//         verticalPosition: 'top',
//         horizontalPosition: 'right',
//       });
//     }
//   }

//   /**
//    * Calls IEX Cloud API and updates the iexStockDataMap variable that maps ticker symbols to stock data
//    */
//   updateIexStockDataMap(): void {
//     const tickerSymbols: string[] = this.portfolioStocks.map((stock: PortfolioStockDto) => stock.ticker);
//     this.iexCloudService
//       .batchGetStocks(tickerSymbols, ['stats', 'company', 'price'])
//       .pipe(takeUntil(this.ngUnsubscribe))
//       .subscribe((result: any) => {
//         this.iexStockDataMap = result;
//       });
//   }
// }

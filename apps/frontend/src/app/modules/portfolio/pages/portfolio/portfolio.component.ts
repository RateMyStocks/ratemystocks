import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { UpdatePortfolioNameDialogComponent } from '../../components/update-portfolio-name-dialog/update-portfolio-name-dialog.component';
import { UpdatePortfolioDescriptionDialogComponent } from '../../components/update-portfolio-description-dialog/update-portfolio-description-dialog.component';
import { MoneyFormatter } from '../../../../shared/utilities/money-formatter';
import {
  CreatePortfolioRatingDto,
  PortfolioDto,
  PortfolioRatingDto,
  PortfolioStockDto,
} from '@ratemystocks/api-interface';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { IexCloudService } from '../../../../core/services/iex-cloud.service';
import { MarketCapThresholds } from '../../../../shared/models/enums/market-cap-thresholds';
import { MarketCap } from '../../../../shared/models/enums/market-cap';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit {
  MoneyFormatter = MoneyFormatter;

  moment = moment;

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

  copiedPortfolioLink: string = window.location.href;

  constructor(
    private authService: AuthService,
    private portfolioService: PortfolioService,
    private iexCloudService: IexCloudService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.isAuth = this.authService.isAuthorized();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const portfolioId = paramMap.get('id');

      // Get the Portfolio
      this.portfolioService.getPortfolio(portfolioId).subscribe((portfolio: PortfolioDto) => {
        this.portfolio = portfolio;

        this.portfolioLoaded = true;
      });

      // Get the Portfolio's stocks
      this.portfolioService.getPortfolioStocks(portfolioId).subscribe((stocks: PortfolioStockDto[]) => {
        this.portfolioStocks = stocks;

        this.stocksLoaded = true;

        if (stocks.length > 0) {
          const tickerSymbols: string[] = this.portfolioStocks.map((stock: PortfolioStockDto) => stock.ticker);
          this.iexCloudService.batchGetStocks(tickerSymbols, ['stats', 'company', 'price']).subscribe((result: any) => {
            this.iexStockDataMap = result;
          });
        }

        this.setStockPieChartBreakdown();
      });

      // Get the Portfolio's ratings
      this.portfolioService
        .getPortfolioRatingCounts(portfolioId)
        .subscribe((ratings: { likes: number; dislikes: number }) => {
          this.numLikes = ratings.likes;
          this.numDislikes = ratings.dislikes;
        });

      // Set the user's portfolio rating if they are logged-in.
      if (this.isAuth) {
        this.portfolioService.getPortfolioUserRating(portfolioId).subscribe((rating: PortfolioRatingDto) => {
          this.portfolioRating = rating;
        });
      }
    });
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
      const iexCloudValue = iexStockMapping.company[iexCompanyField];

      if (iexCloudValue) {
        valueWeightingMap.set(
          iexCloudValue,
          valueWeightingMap.has(iexCloudValue)
            ? valueWeightingMap.get(iexCloudValue) + stock.weighting
            : stock.weighting
        );
      }
    });

    return Array.from(valueWeightingMap, ([name, value]: [string, number]) => ({
      name,
      value,
    })).reduce((prev: { name: string; value: number }, current: { name: string; value: number }) =>
      // TODO: need to handle null values - TypeError: Reduce of empty array with no initial value
      prev.value > current.value ? prev : current
    ).name;
  }

  /**
   * Gets the largest holding of the portfolio based on weighting.
   * @return Ticker symbol of the stock with the highest weighting in the portfolio
   */
  getLargestHolding(): string {
    return this.portfolioStocks.sort((a: PortfolioStockDto, b: PortfolioStockDto) =>
      b.weighting > a.weighting ? 1 : -1
    )[0].ticker;
  }

  /**
   * Gets the "category" from the mat-select dropdown that will be used to update the
   * NGX Pie chart that displays the portfolio breakdowns.
   * @param event The MatSelectChange event that is triggered from the MatSelect dropdown for the Pie chart.
   */
  setPieChartItems(event: MatSelectChange): void {
    const selectedValue: string = event.value;

    switch (selectedValue) {
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
    }
  }

  /**
   * Updates the items that will be displayed in the NGX Pie Chart to show the stock weightings.
   * Shows the top 10 largest holdings with an additional 'Other' category representing all the
   * remaining holdings of the portfolio.
   */
  private setStockPieChartBreakdown(): void {
    let topTenWeighting = 0;

    this.pieChartItems = _.sortBy(this.portfolioStocks, 'weighting')
      .reverse()
      .slice(0, 10)
      .map((stock: PortfolioStockDto) => {
        topTenWeighting += stock.weighting;
        return { name: stock.ticker, value: stock.weighting.toFixed(2) };
      });

    if (this.portfolioStocks.length > 10) {
      const otherWeighting = 100 - topTenWeighting;
      this.pieChartItems.push({ name: 'Other', value: otherWeighting });
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
        categoryWeightingMap.set(
          iexCloudValue,
          categoryWeightingMap.has(iexCloudValue)
            ? categoryWeightingMap.get(iexCloudValue) + stock.weighting
            : stock.weighting
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
   * Click handler function for the like & dislike buttons of the Portfolio. Calls the portfolio service
   * to create, update, or delete a user rating for the portfolio.
   * NOTE: visually, when the like button is pressed, it is okay that it is not in sync with the database
   * When the page is loaded/refreshed, that value will be correct. We just want make sure the number is incremented
   * only by 1 so it is not confusing to the user.
   * @param isLiked True if the "Like" button is clicked, false if the "Dislike" button is clicked
   */
  onRatePortfolio(isLiked: boolean): void {
    if (this.isAuth) {
      const portfolioRatingDto: CreatePortfolioRatingDto = {
        id: this.portfolioRating && this.portfolioRating.id ? this.portfolioRating.id : undefined,
        isLiked,
      };

      // Rating Exists
      if (this.portfolioRating) {
        // Existing rating is a like
        if (this.portfolioRating.isLiked) {
          // DELETE Like Rating
          this.portfolioService.deletePortfolioRating(this.portfolioRating.id).subscribe((result: void) => {
            this.numLikes--;
            this.portfolioRating = null;

            // User clicked dislike
            if (!isLiked) {
              // CREATE Dislike Rating
              this.portfolioService
                .createOrUpdatePortfolioRating(this.portfolio.id, portfolioRatingDto)
                .subscribe((rating: PortfolioRatingDto) => {
                  this.numDislikes++;
                  this.portfolioRating = rating;
                });
            }
          });
        } else {
          // DELETE Dislike Rating
          this.portfolioService.deletePortfolioRating(this.portfolioRating.id).subscribe((result: void) => {
            this.numDislikes--;
            this.portfolioRating = null;

            // User clicked like
            if (isLiked) {
              // CREATE Like Rating
              this.portfolioService
                .createOrUpdatePortfolioRating(this.portfolio.id, portfolioRatingDto)
                .subscribe((rating: PortfolioRatingDto) => {
                  this.numLikes++;
                  this.portfolioRating = rating;
                });
            }
          });
        }
      } else {
        this.portfolioService
          .createOrUpdatePortfolioRating(this.portfolio.id, portfolioRatingDto)
          .subscribe((rating: PortfolioRatingDto) => {
            if (isLiked) {
              this.numLikes++;
            } else {
              this.numDislikes++;
            }

            this.portfolioRating = rating;
          });
      }
    } else {
      this.snackbar.open('You must login to rate portfolios.', 'OK', {
        duration: 3000,
        panelClass: 'warn-snackbar',
      });
    }
  }

  /**
   * Social media icon click event handler to share the portfolio link to the corresponding site.
   * NOTE: When redirecting from localhost, some social media sites will block the request.
   * @param socialMediaUrl The URL of the social media site that the portfolio will be shared on.
   */
  shareOnSocialMedia(socialMediaUrl: string): void {
    window.open(socialMediaUrl + window.location.href, '_blank');
  }

  /** The click handler for the cdkCopyToClipboard directive shows a message when the link is copied. */
  onCopyPageLink(): void {
    this.snackbar.open('Portfolio link copied to clipboard.', 'OK', {
      duration: 3000,
      panelClass: 'success-snackbar',
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  /** Opens a MatDialog with a field to edit the portfolio name */
  openEditPortfolioNameDialog(): void {
    if (this.authService.isAuthorized()) {
      const dialogRef = this.dialog.open(UpdatePortfolioNameDialogComponent, {
        data: {
          portfolio: this.portfolio,
        },
      });
      dialogRef.afterClosed().subscribe((result: PortfolioDto) => {
        if (result) {
          this.portfolio = result;
        }
      });
    }
  }

  /** Opens a MatDialog with a field to edit the portfolio description */
  openEditPortfolioDescriptionDialog(): void {
    if (this.authService.isAuthorized()) {
      const dialogRef = this.dialog.open(UpdatePortfolioDescriptionDialogComponent, {
        data: {
          portfolio: this.portfolio,
        },
      });
      dialogRef.afterClosed().subscribe((result: PortfolioDto) => {
        if (result) {
          this.portfolio = result;
        }
      });
    }
  }
}

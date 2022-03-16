import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IexCloudStockDataDto, StockRatingCountDto } from '@ratemystocks/api-interface';
import { StockService } from '../../../../core/services/stock.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { MoneyFormatter } from '../../../../shared/utilities/money-formatter';
import * as moment from 'moment';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit, OnDestroy {
  // Helper JS functions & types to reference in the template
  MoneyFormatter = MoneyFormatter;
  moment = moment;
  Infinity = Infinity;

  stockRatingsPieChart: any;

  stockRatingChartOptions!: any;

  activeStockRatingIndex!: number;

  ticker = '';
  stock: { rating: StockRatingCountDto; data: IexCloudStockDataDto } = null;
  stockRatingBuyPercent = 0;
  stockRatingHoldPercent = 0;
  stockRatingSellPercent = 0;
  stockLoaded = false;
  followers = 0;
  followerCountsByDay!: any[];
  followerPercentChangeToday = 0;
  noNewFollowers = false;
  visitors = 0;
  visitCountsByDay!: any[];
  visitPercentChangeToday = 0;
  isLoggedInUserFollowing = false;
  isAuth: boolean;
  userRating: string; // string that has the value buy, hold, or sell
  auth$: Subscription;
  private ngUnsubscribe = new Subject();

  constructor(
    private breadcrumbService: AppBreadcrumbService,
    // private appMain: AppMainComponent,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private stockService: StockService,
    private messageService: MessageService,
    private confirmService: ConfirmationService,
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.activeStockRatingIndex = null;
      this.ticker = paramMap.get('ticker');

      this.stockService
        .getStock(this.ticker)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((response: { rating: StockRatingCountDto; data: IexCloudStockDataDto }) => {
          this.stock = response;

          this.title.setTitle(
            `${this.stock.data.company?.companyName} (${this.ticker}) Stock Price, Information, & News - ratemystocks.com`
          );
          this.meta.addTags([
            {
              name: 'description',
              content: `Get real-time stock quote, news, performance, & other information for ${this.ticker}. Rate & discuss stonks with other investors & traders on ratemystocks.com.`,
            },
            {
              name: 'keywords',
              content: `${this.stock.data.company?.companyName}, ${this.stock.data.company?.companyName} stock price, ${this.stock.data.company?.companyName} news, ${this.ticker}, ${this.ticker} stock price, ${this.ticker} news, ${this.ticker} charting, financial forum, stock forum, stock discussion`,
            },
            {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1',
            },
          ]);

          this.stockLoaded = true;

          this.stockRatingsPieChart = this.getStockRatingsChartData(this.stock.rating);

          const totalRatingCount = this.stock.rating.buy + this.stock.rating.hold + this.stock.rating.sell;
          this.stockRatingBuyPercent = totalRatingCount > 0 ? (this.stock.rating.buy / totalRatingCount) * 100 : 0;
          this.stockRatingHoldPercent = totalRatingCount > 0 ? (this.stock.rating.hold / totalRatingCount) * 100 : 0;
          this.stockRatingSellPercent = totalRatingCount > 0 ? (this.stock.rating.sell / totalRatingCount) * 100 : 0;

          this.populateVisitCountsWidget(this.ticker);
          this.populateFollowerCountsWidget(this.ticker);
        });

      this.breadcrumbService.setItems([
        { label: 'Home' },
        { label: 'Stocks', routerLink: ['/stocks'] },
        { label: paramMap.get('ticker') },
      ]);

      this.isAuth = this.authService.isAuthorized();
      if (this.isAuth) {
        this.fetchUserRating();
        this.stockService
          .addStockPageVisit(this.ticker, this.authService.getUserId())
          .subscribe((visitCount: number) => (this.visitors = visitCount));

        this.stockService
          .getTotalFollowerCounts(this.ticker)
          .subscribe((followerCount: number) => (this.followers = followerCount));

        this.stockService.isFollowingStock(this.ticker).subscribe((isFollowingStock: boolean) => {
          this.isLoggedInUserFollowing = isFollowingStock;
        });
      } else {
        this.userRating = null;
        this.stockService
          .addStockPageVisit(this.ticker)
          .subscribe((visitCount: number) => (this.visitors = visitCount));

        this.stockService
          .getTotalFollowerCounts(this.ticker)
          .subscribe((followerCount: number) => (this.followers = followerCount));
      }
    });

    this.auth$ = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuth = authStatus;
      if (this.isAuth) {
        this.fetchUserRating();
        // this.stockService
        //   .addStockPageVisit(this.ticker, this.authService.getUserId())
        //   .subscribe((visitCount: number) => (this.visitors = visitCount));

        this.stockService.isFollowingStock(this.ticker).subscribe((isFollowingStock: boolean) => {
          this.isLoggedInUserFollowing = isFollowingStock;
        });
      }
    });

    this.stockRatingChartOptions = {
      plugins: {
        legend: {
          display: false,
        },
      },
      responsive: true,
      cutout: 70,
      scales: {
        y: {
          type: 'linear',
          display: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    };

    // this.appMain['refreshstockRatingsPieChart'] = () => {
    //   this.stockRatingsPieChart = this.getStockRatingsChartData();
    // };
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   *
   * @param stockRatingCounts
   * @returns
   */
  getStockRatingsChartData(stockRatingCounts: StockRatingCountDto) {
    return {
      labels: ['Buy', 'Hold', 'Sell'],
      datasets: [
        {
          data: [stockRatingCounts.buy, stockRatingCounts.hold, stockRatingCounts.sell],
          backgroundColor: ['#3ac961', '#c98b3a', 'red'],
          hoverBackgroundColor: ['#32a12f', '#bf6f06', '#c94d4d'],
          borderWidth: 0,
        },
      ],
    };
  }

  /**
   * Calls the backend to create a new user active stock rating and deactives the user's previous rating.
   * @param value The rating type e.g. "Buy", "Hold", or "Sell"
   */
  toggleStockRating(event, value: string): void {
    if (this.isAuth) {
      if (this.userRating !== value) {
        this.stock.rating[this.userRating] = this.stock.rating[this.userRating] - 1;
        this.userRating = value;
        this.stock.rating[this.userRating] = this.stock.rating[this.userRating] + 1;

        this.stockService
          .updateUserRating(this.ticker, this.userRating)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe();

        // Index of the stock rating button that is clicked
        const activeRatingIndex = parseInt(event.currentTarget.getAttribute('data-index'));
        this.activeStockRatingIndex = activeRatingIndex;

        this.stockRatingsPieChart.datasets[0].data = [
          this.stock.rating.buy,
          this.stock.rating.hold,
          this.stock.rating.sell,
        ];

        const totalRatingCount = this.stock.rating.buy + this.stock.rating.hold + this.stock.rating.sell;
        this.stockRatingBuyPercent = totalRatingCount > 0 ? (this.stock.rating.buy / totalRatingCount) * 100 : 0;
        this.stockRatingHoldPercent = totalRatingCount > 0 ? (this.stock.rating.hold / totalRatingCount) * 100 : 0;
        this.stockRatingSellPercent = totalRatingCount > 0 ? (this.stock.rating.sell / totalRatingCount) * 100 : 0;
      }
    } else {
      this.confirmService.confirm({
        target: event.target,
        message: 'You must be logged-in to rate this stock. Would you like to login?',
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

  /** Calls the backend to get the user's active rating for a given stock, if it exists. */
  fetchUserRating(): void {
    this.stockService
      .getUserRating(this.ticker)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: { stockRating: string }) => {
        this.userRating = res.stockRating;

        if (this.userRating) {
          switch (this.userRating.toUpperCase()) {
            case 'BUY':
              this.activeStockRatingIndex = 0;
              break;
            case 'HOLD':
              this.activeStockRatingIndex = 1;
              break;
            case 'SELL':
              this.activeStockRatingIndex = 2;
              break;
            default:
              break;
          }
        }
      });
  }

  /**
   * Event handler for clicking the Follow button. Calls the backend to add the logged-in user
   * as a follower to the stock.
   */
  followStock(): void {
    if (this.isAuth) {
      this.stockService.followStock(this.ticker).subscribe(() => {
        this.isLoggedInUserFollowing = true;

        this.stockService
          .getTotalFollowerCounts(this.ticker)
          .subscribe((followerCount: number) => (this.followers = followerCount));
        this.populateFollowerCountsWidget(this.ticker);
      });
    } else {
      this.confirmService.confirm({
        target: event.target,
        message: 'You must be logged-in to follow this stock. Would you like to login?',
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
   * Event handler for clicking the unfollow button on the stock page. Calls the backend to remove the logged-in user
   * as a follower of the stock.
   */
  unfollowStock(): void {
    if (this.isAuth) {
      this.stockService.unfollowStock(this.ticker).subscribe(() => {
        this.isLoggedInUserFollowing = false;

        this.stockService
          .getTotalFollowerCounts(this.ticker)
          .subscribe((followerCount: number) => (this.followers = followerCount));
        this.populateFollowerCountsWidget(this.ticker);
      });
    }
  }

  /**
   * Used to populate the page visits widget showing the number of page visits per day as bars.
   * Sets an array of objects containing number of visits per day and the height in pixels the bar for that day should be.
   */
  populateVisitCountsWidget(ticker: string): void {
    // The max number of pixels the highest "bar" in the visits chart should be.
    const maxHeightPixels = 52;

    this.stockService.getStockVisitCounts(ticker).subscribe((counts: { visit_count: number }[]) => {
      const highestCount = counts
        .map((countObj: any) => countObj.visit_count)
        .reduce((prev, curr) => (prev > curr ? prev : curr));

      this.visitCountsByDay = counts.map((countObj: any) => {
        const dayCount = countObj.visit_count;
        const fractionOfHighestCount = highestCount > 0 ? dayCount / highestCount : 0;
        const pixelCount = maxHeightPixels * fractionOfHighestCount;
        return { visitCount: dayCount, pixelCount: pixelCount > 0 ? pixelCount.toString() + 'px' : '0.1px' };
      });

      this.visitPercentChangeToday =
        ((counts[counts.length - 1].visit_count - counts[counts.length - 2].visit_count) /
          counts[counts.length - 2].visit_count) *
        100;
    });
  }

  populateFollowerCountsWidget(ticker: string): void {
    // The max number of pixels the highest "bar" in the followers chart should be.
    const maxHeightPixels = 52;
    this.stockService.getFollowerCountsLastNDays(ticker).subscribe((counts: { follower_count: number }[]) => {
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
}

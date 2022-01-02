import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
import { AppMainComponent } from '../../../../app.main.component';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
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
  MoneyFormatter = MoneyFormatter;
  moment = moment;

  activeOrders = 0;

  stockRatingsPieChart: any;

  trafficOptions: any;

  activeTraffic!: number;

  ticker = '';
  stock: { rating: StockRatingCountDto; data: IexCloudStockDataDto } = null;
  stockRatingBuyPercent = 0;
  stockRatingHoldPercent = 0;
  stockRatingSellPercent = 0;
  stockLoaded = false;
  followers = 0;
  visitors = 0;
  visitCountsByDay!: any[];
  isLoggedInUserFollowing = false;
  isAuth: boolean;
  userRating: string; // string that has the value buy, hold, or sell
  auth$: Subscription;
  copiedPortfolioLink: string = window.location.href;
  private ngUnsubscribe = new Subject();

  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private appMain: AppMainComponent,
    private route: ActivatedRoute,
    private authService: AuthService,
    private stockService: StockService,
    private messageService: MessageService,
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.activeTraffic = null;
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

          console.log('STOCK: ', this.stock);

          this.stockLoaded = true;

          this.stockRatingsPieChart = this.getStockRatingsChartData(this.stock.rating);

          const totalRatingCount = this.stock.rating.buy + this.stock.rating.hold + this.stock.rating.sell;
          this.stockRatingBuyPercent = totalRatingCount > 0 ? (this.stock.rating.buy / totalRatingCount) * 100 : 0;
          this.stockRatingHoldPercent = totalRatingCount > 0 ? (this.stock.rating.hold / totalRatingCount) * 100 : 0;
          this.stockRatingSellPercent = totalRatingCount > 0 ? (this.stock.rating.sell / totalRatingCount) * 100 : 0;
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

        this.stockService.isFollowingStock(this.ticker).subscribe((isFollowingStock: boolean) => {
          this.isLoggedInUserFollowing = isFollowingStock;
        });
      } else {
        this.userRating = null;
        this.stockService
          .addStockPageVisit(this.ticker)
          .subscribe((visitCount: number) => (this.visitors = visitCount));
      }
    });

    // this.isAuth = this.authService.isAuthorized();
    // if (this.isAuth) {
    //   this.fetchUserRating();
    // } else {
    //   this.userRating = null;
    // }

    this.auth$ = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuth = authStatus;
      if (this.isAuth) {
        this.fetchUserRating();
        this.stockService
          .addStockPageVisit(this.ticker, this.authService.getUserId())
          .subscribe((visitCount: number) => (this.visitors = visitCount));

        this.stockService.isFollowingStock(this.ticker).subscribe((isFollowingStock: boolean) => {
          this.isLoggedInUserFollowing = isFollowingStock;
        });
      }
    });

    this.trafficOptions = {
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
        this.activeTraffic = activeRatingIndex;

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
      this.messageService.add({
        severity: 'warn',
        summary: 'Please Login!',
        detail: 'You must login to rate this stock',
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

        switch (this.userRating.toUpperCase()) {
          case 'BUY':
            this.activeTraffic = 0;
            break;
          case 'HOLD':
            this.activeTraffic = 1;
            break;
          case 'SELL':
            this.activeTraffic = 2;
            break;
          default:
            break;
        }
      });
  }

  followStock(): void {
    if (this.isAuth) {
      this.stockService.followStock(this.ticker).subscribe(() => {
        this.isLoggedInUserFollowing = true;
        // this.messageService.add({
        //   key: 'stockPageToast',
        //   severity: 'success',
        //   summary: `Following ${this.ticker}!`,
        //   detail: 'You are now following this stock for news & updates.',
        // });
      });
    } else {
      this.messageService.add({
        key: 'stockPageToast',
        severity: 'success',
        summary: 'Account Required!',
        detail: 'Please login or sign up if you do not yet have an account.',
      });
    }
  }

  unfollowStock(): void {
    this.stockService.unfollowStock(this.ticker).subscribe(() => {
      this.isLoggedInUserFollowing = false;
      // this.messageService.add({
      //   key: 'stockPageToast',
      //   severity: 'success',
      //   summary: `Unfollowing ${this.ticker}.`,
      //   detail: 'You have unfollowed this stock and will not receive news & updates.',
      // });
    });
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
    this.messageService.add({
      key: 'stockPageToast',
      severity: 'success',
      summary: 'Copied!',
      detail: 'Page link copied to clipboard',
    });
  }

  /**
   *
   * @returns
   */
  getVisitCountsPastWeek(): number[] {
    const maxHeightPixels = 50;

    // loop through

    const totalVisitCountLastNDays = 253;

    const day1Count = 20;
    const day7Count = 100;
    const day7PercentageOfWeekTotal = (day7Count / totalVisitCountLastNDays) * 100;
    const day7PixelCount = maxHeightPixels * day7PercentageOfWeekTotal;

    return null;
  }
}

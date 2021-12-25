import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
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

declare const TradingView: any;
@Component({
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit, OnDestroy, AfterViewInit {
  MoneyFormatter = MoneyFormatter;

  activeOrders = 0;

  trafficChart: any;

  trafficOptions: any;

  activeTraffic = 0;

  items: MenuItem[];

  val1 = 1;

  val2 = 2;

  ticker = '';
  stock: { rating: StockRatingCountDto; data: IexCloudStockDataDto } = null;
  stockLoaded = false;
  followers = 0;
  visitors = 0;
  isAuth: boolean;
  userRating: string;
  auth$: Subscription;
  private ngUnsubscribe = new Subject();

  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private appMain: AppMainComponent,
    private route: ActivatedRoute,
    private authService: AuthService,
    private stockService: StockService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.ticker = paramMap.get('ticker');
      this.stockService
        .getStock(this.ticker)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((response: any) => {
          this.stock = response;

          console.log('STOCK: ', this.stock);

          this.stockLoaded = true;

          // this.updateStockRatingsBarChartItems();
        });
      this.breadcrumbService.setItems([
        { label: 'Home' },
        { label: 'Stocks', routerLink: ['/stocks'] },
        { label: paramMap.get('ticker') },
      ]);
    });
  }

  ngOnInit() {
    this.isAuth = this.authService.isAuthorized();
    if (this.isAuth) {
      this.fetchUserRating();
    } else {
      this.userRating = null;
    }

    this.auth$ = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuth = authStatus;
      if (this.isAuth) {
        this.fetchUserRating();
      }
    });

    this.trafficChart = this.getTrafficChartData();

    this.trafficOptions = {
      plugins: {
        legend: {
          display: false,
        },
      },
      responsive: true,
      cutout: 70,
    };

    this.appMain['refreshTrafficChart'] = () => {
      this.trafficChart = this.getTrafficChartData();
    };
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit() {
    // new TradingView.widget(
    //   {
    //     "width": 980,
    //     "height": 610,
    //   "autosize": true,
    //   "symbol": "NASDAQ:AAPL",
    //   "interval": "D",
    //   "timezone": "Etc/UTC",
    //   "theme": "light",
    //   "style": "2",
    //   "locale": "en",
    //   "toolbar_bg": "#f1f3f6",
    //   "enable_publishing": false,
    //   "container_id": "tradingview_191df"
    // });
    console.log('sfsd');
  }

  getTrafficChartData() {
    return {
      labels: ['Buy Ratings', 'Hold Ratings', 'Sell Ratings'],
      datasets: [
        {
          data: [50, 25, 25],
          backgroundColor: ['#3ac961', '#c98b3a', 'red'],
          hoverBackgroundColor: ['#32a12f', '#bf6f06', '#c94d4d'],
          borderWidth: 0,
        },
      ],
    };
  }

  changeDataset(event) {
    const dataSet = [
      [31, 83, 69, 29, 62, 25, 59, 26, 46],
      [40, 29, 7, 73, 81, 69, 46, 21, 96],
    ];
    const dataSet2 = [
      [67, 98, 27, 88, 38, 3, 22, 60, 56],
      [74, 67, 11, 36, 100, 49, 34, 56, 45],
    ];

    this.activeOrders = parseInt(event.currentTarget.getAttribute('data-index'));
  }

  setUserStockRating(event) {
    const traffidDataSet = [
      [48, 52],
      [26, 74],
      [12, 88],
    ];
    this.activeTraffic = parseInt(event.currentTarget.getAttribute('data-index'));

    this.trafficChart.datasets[0].data = traffidDataSet[parseInt(event.currentTarget.getAttribute('data-index'))];
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
        console.log('USER RATING: ', this.userRating);
        this.stockService
          .updateUserRating(this.ticker, this.userRating)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe();

        // this.ratingUpdated.emit();
      }
    } else {
      // this.snackBar.open('You must login to rate this stock.', 'OK', {
      //   duration: 3000,
      //   panelClass: 'warn-snackbar',
      // });
    }

    const traffidDataSet = [
      [48, 52],
      [26, 74],
      [12, 88],
    ];
    this.activeTraffic = parseInt(event.currentTarget.getAttribute('data-index'));

    this.trafficChart.datasets[0].data = traffidDataSet[parseInt(event.currentTarget.getAttribute('data-index'))];
  }

  /** Calls the backend to get the user's active rating for a given stock, if it exists. */
  fetchUserRating(): void {
    this.stockService
      .getUserRating(this.ticker)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: { stockRating: string }) => {
        this.userRating = res.stockRating;
      });
  }
}

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { ActivatedRoute, ParamMap } from '@angular/router';
// import { Subscription } from 'rxjs';
// import { StockRatingCountDto, IexCloudStockDataDto } from '@ratemystocks/api-interface';
// import { AuthService } from '../../../../core/services/auth.service';
// import { MoneyFormatter } from '../../../../shared/utilities/money-formatter';
// import { StockService } from '../../../../core/services/stock.service';
// import * as moment from 'moment';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';

// @Component({
//   selector: 'app-stock',
//   templateUrl: './stock.component.html',
//   styleUrls: ['./stock.component.scss'],
// })
// export class StockComponent implements OnInit, OnDestroy {
//   ticker: string;

//   moment = moment;

//   MoneyFormatter = MoneyFormatter;
//   isAuth: boolean;
//   userRating: string;
//   stock: { rating: StockRatingCountDto; data: IexCloudStockDataDto } = null;
//   auth$: Subscription;

//   stockRatingBarChartItems: {
//     buyRating: { name: string; value: number };
//     holdRating: { name: string; value: number };
//     sellRating: { name: string; value: number };
//   };

//   stockLoaded = false;

//   private ngUnsubscribe = new Subject();

//   constructor(private route: ActivatedRoute, private stockService: StockService, private authService: AuthService) {}

//   ngOnInit(): void {
//     this.isAuth = this.authService.isAuthorized();
//     this.auth$ = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
//       this.isAuth = authStatus;
//     });

//     this.route.paramMap.subscribe((paramMap: ParamMap) => {
//       this.ticker = paramMap.get('ticker');
//       this.stockService
//         .getStock(this.ticker)
//         .pipe(takeUntil(this.ngUnsubscribe))
//         .subscribe((response: any) => {
//           this.stock = response;

//           this.stockLoaded = true;

//           this.updateStockRatingsBarChartItems();
//         });
//     });
//   }

//   ngOnDestroy(): void {
//     this.auth$.unsubscribe();

//     this.ngUnsubscribe.next();
//     this.ngUnsubscribe.complete();
//   }

//   /** Event handler for the Stock Page Header emitting an event when the user clicks a rating button */
//   onRatingUpdated(): void {
//     this.updateStockRatingsBarChartItems();
//   }

//   /** Sets an array of objects representing a stock rating counts that will be passed to the Ngx Bar Chart */
//   updateStockRatingsBarChartItems(): void {
//     this.stockRatingBarChartItems = {
//       buyRating: { name: 'Buy', value: this.stock.rating.buy },
//       holdRating: { name: 'Hold', value: this.stock.rating.hold },
//       sellRating: { name: 'Sell', value: this.stock.rating.sell },
//     };
//   }
// }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { StockRatingCountDto, IexCloudStockDataDto } from '@ratemystocks/api-interface';
import { AuthService } from '../../../../core/services/auth.service';
import { MoneyFormatter } from '../../../../shared/utilities/money-formatter';
import { StockService } from '../../../../core/services/stock.service';
import * as moment from 'moment';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit, OnDestroy {
  ticker: string;

  moment = moment;

  MoneyFormatter = MoneyFormatter;
  isAuth: boolean;
  userRating: string;
  stock: { rating: StockRatingCountDto; data: IexCloudStockDataDto } = null;
  auth$: Subscription;

  stockRatingBarChartItems: { name: string; value: number }[];

  stockLoaded = false;

  constructor(private route: ActivatedRoute, private stockService: StockService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuth = this.authService.isAuthorized();
    this.auth$ = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuth = authStatus;
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.ticker = paramMap.get('ticker');
      this.stockService.getStock(this.ticker).subscribe((response: any) => {
        this.stock = response;

        this.stockLoaded = true;

        this.updateStockRatingsBarChartItems();
      });
    });
  }

  ngOnDestroy(): void {
    this.auth$.unsubscribe();
  }

  /** Event handler for the Stock Page Header emitting an event when the user clicks a rating button */
  onRatingUpdated(): void {
    this.updateStockRatingsBarChartItems();
  }

  /** Sets an array of objects representing a stock rating counts that will be passed to the Ngx Bar Chart */
  updateStockRatingsBarChartItems(): void {
    this.stockRatingBarChartItems = [
      { name: 'Buy', value: this.stock.rating.buy },
      { name: 'Hold', value: this.stock.rating.hold },
      { name: 'Sell', value: this.stock.rating.sell },
    ];
  }
}

import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import * as moment from 'moment';
import { IexCloudService } from '../../../../core/services/iex-cloud.service';
import { takeUntil } from 'rxjs/operators';
import { MoneyFormatter } from '../../../../shared/utilities/money-formatter';
import { IexCloudSecurityType } from '@ratemystocks/api-interface';

@Component({
  selector: 'app-saved-stocks-table',
  templateUrl: './saved-stocks-table.component.html',
  styleUrls: ['./saved-stocks-table.component.scss'],
})
export class SavedStocksTableComponent implements OnInit {
  loggedInUserId: string;
  MoneyFormatter = MoneyFormatter;
  IexCloudSecurityType = IexCloudSecurityType;

  stocks = [];
  // iexStockDataMap: { [ticker: string]: { company: object; quote: object; stats: object } };
  iexStockDataMap: unknown;

  moment = moment;

  stocksLoaded = false;

  private ngUnsubscribe = new Subject();

  constructor(private userService: UserService, private iexCloudService: IexCloudService) {}

  ngOnInit(): void {
    this.userService
      .getSavedStocksForUser()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((stocks: any[]) => {
        this.stocks = stocks;

        if (stocks.length > 0) {
          this.updateIexStockDataMap();
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /** Updates the map of ticker symbols to IEX Cloud API data */
  updateIexStockDataMap(): void {
    const tickerSymbols: string[] = this.stocks.map((stock: any) => stock.ticker);
    this.iexCloudService
      .batchGetStocks(tickerSymbols, ['stats', 'company', 'quote'])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: any) => {
        this.iexStockDataMap = result;
      });
  }
}

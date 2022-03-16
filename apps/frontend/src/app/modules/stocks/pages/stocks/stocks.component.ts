import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
import { MoneyFormatter } from '../../../../shared/utilities/money-formatter';
import { FormControl } from '@angular/forms';
import { MarketCap } from '../../../../shared/models/enums/market-cap';
import { StockService } from '../../../../core/services/stock.service';
import { IexCloudService } from '../../../../core/services/iex-cloud.service';
import { IexCloudSecurityType, StockRatingListItem } from '@ratemystocks/api-interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IexCloudCountryToIsoCode } from '../../../../shared/utilities/iex-cloud-country-to-code';
import { SortEvent } from 'primeng/api';
import { Meta, Title } from '@angular/platform-browser';

enum FilterType {
  Search,
  Country,
  Sector,
  MarketCap,
}

interface StocksTableDropdownType {
  name: string;
  code: 'most-popular' | 'most-liked' | 'most-disliked';
}

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss'],
  styles: [
    `
      :host ::ng-deep .p-datatable-gridlines p-progressBar {
        width: 100%;
      }

      @media screen and (max-width: 960px) {
        :host ::ng-deep .p-datatable.p-datatable-customers.rowexpand-table .p-datatable-tbody > tr > td:nth-child(6) {
          display: flex;
        }
      }
    `,
  ],
})
export class StocksComponent implements OnInit, OnDestroy {
  // MoneyFormatter & FilterType are needed in the HTML template, so they must be initialized like this
  MoneyFormatter = MoneyFormatter;
  IexCloudCountryToIsoCode = IexCloudCountryToIsoCode;
  FilterType = FilterType;
  IexCloudSecurityType = IexCloudSecurityType;

  stocks: StockRatingListItem[] = [];
  // iexStockDataMap: { [ticker: string]: { company: object; quote: object; stats: object } };
  iexStockDataMap: unknown;

  countries = new FormControl();
  countryList: Set<string> = new Set();

  marketCap = new FormControl();
  marketCapList: string[] = [
    MarketCap.MegaCap,
    MarketCap.LargeCap,
    MarketCap.MidCap,
    MarketCap.SmallCap,
    MarketCap.MicroCap,
  ];

  sectors = new FormControl();
  sectorList: Set<string> = new Set();

  textSearchFilterBeingApplied: string;
  countryFiltersBeingApplied: Set<string> = new Set();
  marketCapFiltersBeingApplied: Set<string> = new Set();
  sectorFiltersBeingApplied: Set<string> = new Set();

  selectedListType!: StocksTableDropdownType;
  listTypes: StocksTableDropdownType[] = [
    { name: 'Most Popular', code: 'most-popular' },
    { name: 'Most Liked', code: 'most-liked' },
    { name: 'Most Disliked', code: 'most-disliked' },
  ];

  selectedTimeFrame;
  timeframes = [
    { value: 'all-time', name: 'All-time' },
    { value: 1, name: 'Last 24 Hours' },
    { value: 7, name: 'Last 7 Days' },
    { value: 30, name: 'Last 30 Days' },
  ];
  private ngUnsubscribe = new Subject();

  @ViewChild('dt') table!: Table;

  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private stockService: StockService,
    private iexCloudService: IexCloudService,
    private meta: Meta,
    private title: Title
  ) {
    this.title.setTitle(`Trending Stocks - ratemystocks.com`);
    this.meta.addTags([
      {
        name: 'description',
        content: `Get real-time stock quote, news, performance, & other information for on ratemystocks.com`,
      },
      {
        name: 'keywords',
        content: `trending stocks, trending stocks today, trending stocks right now, trending stocsk to buy, stocks to buy now, stocks to invest in, stonkz, stonks, stonks meme, `,
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ]);

    this.breadcrumbService.setItems([{ label: 'Home' }, { label: 'Stocks', routerLink: ['/uikit/table'] }]);
  }

  ngOnInit() {
    this.selectedListType = this.listTypes[0];
    this.selectedTimeFrame = this.timeframes[0];

    this.stockService.getStocks('most-popular').subscribe((stocks: StockRatingListItem[]) => {
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

        // Populate list to populate Country Filter dropdown
        this.stocks.forEach((stock: any) => {
          this.countryList.add(this.iexStockDataMap[stock.ticker]?.company?.country);
          this.sectorList.add(this.iexStockDataMap[stock.ticker]?.company?.sector);
        });
      });
  }

  /**
   *
   * @param event
   */
  onSelectListType(event: unknown) {
    const lastNDays: number = this.selectedTimeFrame.value !== 'all-time' ? this.selectedTimeFrame.value : null;
    this.stockService.getStocks(this.selectedListType.code, lastNDays).subscribe((stocks: StockRatingListItem[]) => {
      this.stocks = stocks;

      if (stocks.length > 0) {
        this.updateIexStockDataMap();
      }
    });
  }

  /**
   *
   * @param event
   */
  customSort(event: SortEvent) {
    if (event.field === 'country') {
      event.data.sort((data1, data2) => {
        return this.sortCompare(
          event,
          this.iexStockDataMap[data1.ticker]?.company?.country,
          this.iexStockDataMap[data2.ticker]?.company?.country
        );
      });
    } else if (event.field === 'price') {
      event.data.sort((data1, data2) => {
        return this.sortCompare(
          event,
          this.iexStockDataMap[data1.ticker]?.quote?.latestPrice,
          this.iexStockDataMap[data2.ticker]?.quote?.latestPrice
        );
      });
    } else if (event.field === 'sector') {
      event.data.sort((data1, data2) => {
        return this.sortCompare(
          event,
          this.iexStockDataMap[data1.ticker]?.company?.sector,
          this.iexStockDataMap[data2.ticker]?.company?.sector
        );
      });
    } else if (event.field === 'dividend') {
      event.data.sort((data1, data2) => {
        return this.sortCompare(
          event,
          this.iexStockDataMap[data1.ticker]?.stats?.dividendYield,
          this.iexStockDataMap[data2.ticker]?.stats?.dividendYield
        );
      });
    } else if (event.field === 'marketcap') {
      event.data.sort((data1, data2) => {
        return this.sortCompare(
          event,
          this.iexStockDataMap[data1.ticker]?.stats?.marketcap,
          this.iexStockDataMap[data2.ticker]?.stats?.marketcap
        );
      });
    } else {
      event.data.sort((data1, data2) => {
        return this.sortCompare(event, data1[event.field], data2[event.field]);
      });
    }
  }

  private sortCompare(event, data1, data2) {
    const value1 = data1;
    const value2 = data2;
    let result = null;

    if (value1 == null && value2 != null) result = -1;
    else if (value1 != null && value2 == null) result = 1;
    else if (value1 == null && value2 == null) result = 0;
    else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
    else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

    return event.order * result;
  }
}

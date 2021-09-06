import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MoneyFormatter } from '../../../../shared/utilities/money-formatter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { StockService } from 'apps/frontend/src/app/core/services/stock.service';
import { IexCloudService } from 'apps/frontend/src/app/core/services/iex-cloud.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { MarketCap } from '../../../../shared/models/enums/market-cap';
import { MarketCapThresholds } from '../../../../shared/models/enums/market-cap-thresholds';

enum FilterType {
  Search,
  Country,
  Sector,
  MarketCap,
}

@Component({
  selector: 'app-stocks-table',
  templateUrl: './stocks-table.component.html',
  styleUrls: ['./stocks-table.component.scss'],
})
export class StocksTableComponent implements OnInit, OnDestroy {
  // MoneyFormatter & FilterType are needed in the HTML template, so they must be initialized like this
  MoneyFormatter = MoneyFormatter;
  FilterType = FilterType;

  displayedColumns: string[] = [
    'rank',
    'ticker',
    'buy_count',
    'hold_count',
    'sell_count',
    'price',
    'country',
    'dividendYield',
    'marketCap',
    'sector',
  ];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') textFilter: ElementRef;
  @ViewChild('countryFilterDropdown') countryFilterDropdown: MatSelect;
  @ViewChild('marketCapFilterDropdown') marketCapFilterDropdown: MatSelect;
  @ViewChild('sectorFilterDropdown') sectorFilterDropdown: MatSelect;

  // TODO: need type
  stocks: any[];
  // TODO: Need interface for this
  iexStockDataMap: any;

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

  defaultListType = 'top-100';
  listTypes = [
    { value: 'top-100', viewValue: 'Most Popular' },
    { value: 'pizza-1', viewValue: 'Most Liked' },
    { value: 'tacos-2', viewValue: 'Most Disliked' },
  ];

  defaultTimeframe = 'all-time';
  timeframes = [
    { value: 'all-time', viewValue: 'All-time' },
    { value: 1, viewValue: 'Today' },
    { value: 7, viewValue: 'Last 7 Days' },
    { value: 30, viewValue: 'Last 30 Days' },
  ];

  private ngUnsubscribe = new Subject();

  constructor(private stockService: StockService, private iexCloudService: IexCloudService) {}

  ngOnInit(): void {
    this.stockService.getStocks().subscribe((stocks: any[]) => {
      this.stocks = stocks;
      this.dataSource = new MatTableDataSource(this.stocks);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item: any, property: any) => {
        switch (property) {
          case 'dividendYield':
            return this.iexStockDataMap[item.ticker]?.stats?.dividendYield;
          case 'marketCap':
            return parseFloat(this.iexStockDataMap[item.ticker]?.stats?.marketcap);
          case 'price':
            return this.iexStockDataMap[item.ticker]?.price;
          default: {
            const sortValueToNumber = parseFloat(item[property]);
            return sortValueToNumber ? sortValueToNumber : item[property];
          }
        }
      };

      if (stocks.length > 0) {
        this.updateIexStockDataMap();
      }

      // Predicate that will be checked against every item in the table when dataSource.filter is updated.
      this.dataSource.filterPredicate = _.bind(this.customFilterPredicate, this);
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;

    // Set the text search value to a member variable so the filterPredicate can work with multiple filters
    this.textSearchFilterBeingApplied = filterValue.trim().toLowerCase();

    // Setting dataSource.filter will trigger the datasource's filterPredicate function.
    // Technically we aren't using the filterValue itself isn't being used by the filterPredicate
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // TODO: this might not be the best option. We are doing this b/c deleting the last character in the input field
    // doesn't trigger this applyFilter function
    if (!filterValue) {
      this.resetFilters();
    }
  }

  applyFilterForDropdowns(event: any, filterType: FilterType) {
    const filterValues: string[] = event.value;

    console.log('FILTERING:', filterValues);

    // Set the dropdown filter values to a member variable so the filterPredicate can work with multiple filters
    switch (filterType) {
      case FilterType.Country:
        this.countryFiltersBeingApplied = new Set(filterValues);
        break;
      case FilterType.MarketCap:
        this.marketCapFiltersBeingApplied = new Set(filterValues);
        break;
      case FilterType.Sector:
        this.sectorFiltersBeingApplied = new Set(filterValues);
        break;
    }

    // Setting dataSource.filter will trigger the datasource's filterPredicate function.
    // Technically we aren't using the filterValue itself isn't being used by the filterPredicate
    this.dataSource.filter = event.value;
  }

  /**
   * Predicate function that will be checked against every item in the table when dataSource.filter is updated.
   * Determines whether that table row containing the PortfolioStock should be filtered or not.
   * @param data The PortfolioStock object that is rendered in a MatDatsSource table row.
   * @param filterValue The filter text (text search) or the array of filter values (multiselect dropdown).
   * @return True if that PortfolioStock will be included in the results, false if it will be filtered out
   */
  customFilterPredicate(data: any, filterValue: string | string[]): boolean {
    let hasSearchMatch = false;
    if (this.textSearchFilterBeingApplied) {
      hasSearchMatch =
        data.ticker.toLowerCase().includes(this.textSearchFilterBeingApplied.trim().toLowerCase()) ||
        this.iexStockDataMap[data.ticker]?.company?.companyName
          ?.toLowerCase()
          .includes(this.textSearchFilterBeingApplied.trim().toLowerCase());
    } else {
      hasSearchMatch = true;
    }

    let hasCountry = false;
    if (this.countryFiltersBeingApplied.size > 0) {
      for (const term of this.countryFiltersBeingApplied) {
        if (this.iexStockDataMap[data.ticker]?.company?.country?.trim().toLowerCase() === term.trim().toLowerCase()) {
          hasCountry = true;
          break;
        }
      }
    } else {
      hasCountry = true;
    }

    let hasMarketCap = false;
    if (this.marketCapFiltersBeingApplied.size > 0) {
      const marketCap = this.iexStockDataMap[data.ticker]?.stats?.marketcap;
      for (const term of this.marketCapFiltersBeingApplied) {
        switch (term) {
          case MarketCap.MegaCap:
            hasMarketCap = marketCap >= MarketCapThresholds.MegaCap;
            break;
          case MarketCap.LargeCap:
            hasMarketCap = marketCap < MarketCapThresholds.MegaCap && marketCap >= MarketCapThresholds.LargeCap;
            break;
          case MarketCap.MidCap:
            hasMarketCap = marketCap < MarketCapThresholds.LargeCap && marketCap >= MarketCapThresholds.MidCap;
            break;
          case MarketCap.SmallCap:
            hasMarketCap = marketCap < MarketCapThresholds.MidCap && marketCap >= MarketCapThresholds.SmallCap;
            break;
          case MarketCap.MicroCap:
            hasMarketCap = marketCap < MarketCapThresholds.SmallCap && marketCap >= MarketCapThresholds.MicroCap;
            break;
          default:
            break;
        }

        if (hasMarketCap) {
          break;
        }
      }
    } else {
      hasMarketCap = true;
    }

    let hasSector = false;
    if (this.sectorFiltersBeingApplied.size > 0) {
      for (const term of this.sectorFiltersBeingApplied) {
        if (this.iexStockDataMap[data.ticker]?.company?.sector?.trim().toLowerCase() === term.trim().toLowerCase()) {
          hasSector = true;
          break;
        }
      }
    } else {
      hasSector = true;
    }

    return hasSearchMatch && hasCountry && hasMarketCap && hasSector;
  }

  resetFilters(): void {
    this.textFilter.nativeElement.value = '';
    this.countryFilterDropdown.options.forEach((data: MatOption) => data.deselect());
    this.marketCapFilterDropdown.options.forEach((data: MatOption) => data.deselect());
    this.sectorFilterDropdown.options.forEach((data: MatOption) => data.deselect());

    // triggers the filterPredicate, so must be called at the end
    this.dataSource.filter = '';
  }

  updateIexStockDataMap(): void {
    const tickerSymbols: string[] = this.stocks.map((stock: any) => stock.ticker);
    this.iexCloudService
      .batchGetStocks(tickerSymbols, ['stats', 'company', 'price', 'quote'])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: any) => {
        this.iexStockDataMap = result;

        console.log(this.iexStockDataMap);

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
  onListTypeChanged(event): void {
    console.log('LIST TYPE CHANGED');

    this.stocks = [];

    // Refresh table when datasource changes
    this.dataSource.data = this.stocks;
  }

  /**
   *
   * @param event
   */
  onTimeFrameChanged(event: MatSelectChange): void {
    const lastNDays: number = event.value !== 'all-time' ? event.value : null;

    this.stockService.getStocks(lastNDays).subscribe((stocks: any[]) => {
      this.stocks = stocks;

      if (stocks.length > 0) {
        this.updateIexStockDataMap();
      }

      // Predicate that will be checked against every item in the table when dataSource.filter is updated.
      this.dataSource.filterPredicate = _.bind(this.customFilterPredicate, this);
      // Refresh table when datasource changes
      this.dataSource.data = this.stocks;
    });
  }
}

import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { MoneyFormatter } from '../../../../shared/utilities/money-formatter';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { MarketCap } from '../../../../shared/models/enums/market-cap';
import { MarketCapThresholds } from '../../../../shared/models/enums/market-cap-thresholds';
import { PortfolioStockDto, IexCloudSecurityType } from '@ratemystocks/api-interface';
import { SortEvent } from 'primeng/api';
// import * as FileSaver from 'file-saver';
enum FilterType {
  Search,
  Country,
  Sector,
  MarketCap,
}

@Component({
  selector: 'app-portfolio-holdings-table-readonly',
  templateUrl: './portfolio-holdings-table-readonly.component.html',
  styleUrls: ['./portfolio-holdings-table-readonly.component.scss'],
})
export class PortfolioHoldingsTableReadonlyComponent implements AfterViewInit, AfterContentInit, OnChanges {
  // MoneyFormatter & FilterType are needed in the HTML template, so they must be initialized like this
  MoneyFormatter = MoneyFormatter;
  IexCloudSecurityType = IexCloudSecurityType;
  FilterType = FilterType;

  // dataSource: MatTableDataSource<PortfolioStockDto>;

  // @ViewChild('input') textFilter: ElementRef;
  // @ViewChild('countryFilterDropdown') countryFilterDropdown: MatSelect;
  // @ViewChild('sectorFilterDropdown') sectorFilterDropdown: MatSelect;
  // @ViewChild('marketCapFilterDropdown') marketCapFilterDropdown: MatSelect;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  @Input()
  portfolioStocks: PortfolioStockDto[];

  // TODO: Need interface for this
  @Input()
  iexStockDataMap: any;

  topTenTotalWeighting: number;

  countries = new FormControl();
  countryList: Set<string> = new Set();

  sectors = new FormControl();
  sectorList: Set<string> = new Set();

  marketCap = new FormControl();
  marketCapList: string[] = [
    MarketCap.MegaCap,
    MarketCap.LargeCap,
    MarketCap.MidCap,
    MarketCap.SmallCap,
    MarketCap.MicroCap,
  ];

  textSearchFilterBeingApplied: string;
  countryFiltersBeingApplied: Set<string> = new Set();
  sectorFiltersBeingApplied: Set<string> = new Set();
  marketCapFiltersBeingApplied: Set<string> = new Set();

  constructor() {
    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(this.portfolioStocks);
  }

  ngAfterViewInit() {
    // this.dataSource = new MatTableDataSource(this.portfolioStocks);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sortingDataAccessor = (item: PortfolioStockDto, property: any) => {
    //   switch (property) {
    //     case 'companyName':
    //       return this.iexStockDataMap[item.ticker]?.stats?.companyName?.toUpperCase();
    //     case 'dividendYield':
    //       return this.iexStockDataMap[item.ticker]?.stats?.dividendYield;
    //     case 'marketCap':
    //       return parseFloat(this.iexStockDataMap[item.ticker]?.stats?.marketcap);
    //     case 'price':
    //       return this.iexStockDataMap[item.ticker]?.price;
    //     default: {
    //       const sortValueToNumber = parseFloat(item[property]);
    //       return sortValueToNumber ? sortValueToNumber : item[property];
    //     }
    //   }
    // };
    // this.dataSource.sort = this.sort;
    // // Predicate that will be checked against every item in the table when dataSource.filter is updated.
    // this.dataSource.filterPredicate = _.bind(this.customFilterPredicate, this);
    console.log('TEST');
  }

  ngAfterContentInit() {
    // // TODO: Make this a pipe
    // this.topTenTotalWeighting = this.portfolioStocks.length
    //   ? _.sortBy(this.portfolioStocks, 'weighting')
    //       .reverse()
    //       .slice(0, 10)
    //       .map((stock: PortfolioStockDto) => stock.weighting)
    //       .reduce((acc: number, currentValue: number) => acc + currentValue)
    //   : 0;
  }

  ngOnChanges() {
    // if (this.iexStockDataMap) {
    //   this.countryList = new Set();
    //   this.sectorList = new Set();
    //   this.portfolioStocks.forEach((stock: PortfolioStockDto) => {
    //     this.countryList.add(this.iexStockDataMap[stock.ticker]?.company?.country);
    //     this.sectorList.add(this.iexStockDataMap[stock.ticker]?.company?.sector);
    //   });
    // }
    // Refresh table when datasource changes
    // this.dataSource.data = this.portfolioStocks;
  }

  calculateTopTenTotalWeighting() {
    // TODO: Make this a pipe
    return this.portfolioStocks.length
      ? _.sortBy(this.portfolioStocks, 'weighting')
          .reverse()
          .slice(0, 10)
          .map((stock: PortfolioStockDto) => stock.weighting)
          .reduce((acc: number, currentValue: number) => acc + currentValue)
      : 0;
  }

  /**
   * Calculates the weighted average of some IEX Cloud API stat field of all stocks in the portfolio.
   * @return The asset-weighted average of some data for all the stocks in the portfolio as a decimal.
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
   * Event handler for a keyup event of the table's text filter field.
   * @param event The keyup evnet containing the enteredtext input.
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;

    // Set the text search value to a member variable so the filterPredicate can work with multiple filters
    this.textSearchFilterBeingApplied = filterValue.trim().toLowerCase();

    // Setting dataSource.filter will trigger the datasource's filterPredicate function.
    // Technically we aren't using the filterValue itself isn't being used by the filterPredicate
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // TODO: this might not be the best option. We are doing this b/c deleting the last character in the input field
    // doesn't trigger this applyFilter function
    if (!filterValue) {
      this.resetFilters();
    }
  }

  /**
   * Event handler for a change event on any of the table's multiselect dropdowns.
   * @param event The change event containing the filter value
   * @param filterType The enum representing which of the multiselect dropdowns is being acted upon.
   */
  applyFilterForDropdowns(event: any, filterType: FilterType) {
    const filterValues: string[] = event.value;

    // Set the dropdown filter values to a member variable so the filterPredicate can work with multiple filters
    switch (filterType) {
      case FilterType.Country:
        this.countryFiltersBeingApplied = new Set(filterValues);
        break;
      case FilterType.Sector:
        this.sectorFiltersBeingApplied = new Set(filterValues);
        break;
      case FilterType.MarketCap:
        this.marketCapFiltersBeingApplied = new Set(filterValues);
        break;
    }

    // Setting dataSource.filter will trigger the datasource's filterPredicate function.
    // Technically we aren't using the filterValue itself isn't being used by the filterPredicate
    // this.dataSource.filter = event.value;
  }

  /**
   * Predicate function that will be checked against every item in the table when dataSource.filter is updated.
   * Determines whether that table row containing the PortfolioStock should be filtered or not.
   * @param data The PortfolioStock object that is rendered in a MatDatsSource table row.
   * @param filterValue The filter text (text search) or the array of filter values (multiselect dropdown).
   * @return True if that PortfolioStock will be included in the results, false if it will be filtered out
   */
  customFilterPredicate(data: PortfolioStockDto, filterValue: string | string[]): boolean {
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

    return hasSearchMatch && hasCountry && hasSector && hasMarketCap;
  }

  /** Resets the values of all the table filter components i.e. search inputs & multiselect dropdowns */
  resetFilters(): void {
    // this.textFilter.nativeElement.value = '';
    // this.countryFilterDropdown.options.forEach((data: MatOption) => data.deselect());
    // this.sectorFilterDropdown.options.forEach((data: MatOption) => data.deselect());
    // this.marketCapFilterDropdown.options.forEach((data: MatOption) => data.deselect());
    // // triggers the filterPredicate, so must be called at the end
    // this.dataSource.filter = '';
  }

  exportPdf() {
    // import("jspdf").then(jsPDF => {
    //     import("jspdf-autotable").then(x => {
    //         const doc = new jsPDF.default(0,0);
    //         doc.autoTable(this.exportColumns, this.products);
    //         doc.save('products.pdf');
    //     })
    // })
  }

  exportExcel() {
    // import("xlsx").then(xlsx => {
    //     const worksheet = xlsx.utils.json_to_sheet(this.products);
    //     const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //     this.saveAsExcelFile(excelBuffer, "products");
    // });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    // const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    // const EXCEL_EXTENSION = '.xlsx';
    // const data: Blob = new Blob([buffer], {
    //     type: EXCEL_TYPE
    // });
    // FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
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
        console.log(
          'SORTING',
          data1[event.field],
          data2[event.field],
          this.sortCompare(event, data1[event.field], data2[event.field])
        );
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

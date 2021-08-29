import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { IexCloudService } from '../../../../core/services/iex-cloud.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as Highcharts from 'highcharts/highstock';
import { IexCloudHistoricalPriceDto } from '@ratemystocks/api-interface';

/**
 * Component utilizing the Stock Chart from Highcharts that will show historical data for a given stock
 * populating with data from IEX Cloud API.
 * {@link https://stackblitz.com/edit/highcharts-angular-stock?file=src%2Fapp%2Fapp.component.ts}
 * {@link https://www.highcharts.com/demo/stock/basic-line}
 */
@Component({
  selector: 'app-stock-performance-chart',
  templateUrl: './stock-performance-chart.component.html',
  styleUrls: ['./stock-performance-chart.component.scss'],
})
export class StockPerformanceChartComponent implements OnInit, OnChanges {
  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options;

  @Input()
  ticker: string;

  private ngUnsubscribe: Subject<void> = new Subject();

  initialized = false;

  constructor(private iexCloudService: IexCloudService) {}

  initialize(): void {
    this.iexCloudService
      .getStockCharts(this.ticker, '5y')
      .pipe(takeUntil(this.ngUnsubscribe.asObservable()))
      .subscribe((response: IexCloudHistoricalPriceDto[]) => {
        const highChartsData = this.mapIexCloudHistoricalPricesToHighchartsFormat(response);

        this.chartOptions = {
          rangeSelector: {
            allButtonsEnabled: true,
            buttons: [
              {
                type: 'month',
                count: 1,
                text: '1m',
              },
              {
                type: 'month',
                count: 3,
                text: '3m',
              },
              {
                type: 'month',
                count: 6,
                text: '6m',
              },
              {
                type: 'ytd',
                text: 'YTD',
              },
              {
                type: 'year',
                count: 1,
                text: '1y',
              },
              {
                type: 'year',
                count: 5,
                text: '5y',
              },
            ],
          },
          series: [
            {
              type: 'line',
              pointInterval: 24 * 3600 * 1000,
              data: highChartsData,
            },
          ],
        };
      });
  }

  ngOnInit(): void {
    this.initialize();
    this.initialized = true;
  }

  ngOnChanges(): void {
    // If the input ticker symbol changes due to a new stock page being loaded by the Angular router,
    // we need to re-initialize this component and load the new data. This won't get called if loading the stock page component for the first time
    if (this.initialized) {
      this.initialize();
    }
  }

  /**
   * Maps data returned IEX Cloud API to the data format that the Highcharts Stock Chart expects
   * @param iexCloudHistoricalPrices An array of objects/dtos from IEX Cloud where each object represents a historical stock price from a single day.
   * @return An 2D array, where each child array contains the format [<DATETIME-IN-MILLISECONDS>, <STOCK-PRICE>]
   */
  mapIexCloudHistoricalPricesToHighchartsFormat(iexCloudHistoricalPrices: IexCloudHistoricalPriceDto[]): number[][] {
    const highchartsStockChartData = iexCloudHistoricalPrices.map((x: IexCloudHistoricalPriceDto) => {
      return [Date.parse(x.date), x.fClose];
    });

    return highchartsStockChartData;
  }
}

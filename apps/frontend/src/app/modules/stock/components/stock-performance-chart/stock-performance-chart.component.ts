import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockService } from '../../../../core/services/stock.service';
import { AuthService } from '../../../../core/services/auth.service';
import { IexCloudService } from '../../../../core/services/iex-cloud.service';

@Component({
  selector: 'app-stock-performance-chart',
  templateUrl: './stock-performance-chart.component.html',
  styleUrls: ['./stock-performance-chart.component.scss'],
})
export class StockPerformanceChartComponent implements OnInit, OnChanges {
  chartData: any[];
  selectedTimeLabels: string[] = [];
  scheme = {
    domain: ['#5AA454'],
  };
  range = '1d';

  @Input()
  ticker: string;

  constructor(
    private route: ActivatedRoute,
    private stockService: StockService,
    private authService: AuthService,
    private iexCloudService: IexCloudService
  ) {}

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(): void {
    this.updateChart();
  }

  /**
   * Updates ngx-charts based on what date option is selected
   */
  updateChart(): void {
    this.iexCloudService.getStockCharts(this.ticker, this.range).subscribe((response: any[]) => {
      let series: any[] = [];
      this.selectedTimeLabels = [];
      if (this.range === '1d') {
        series = this.generateInterDaySeries(response);
      } else {
        series = this.generateHistoricalSeries(response);
      }
      this.chartData = [
        ...[
          {
            name: this.ticker,
            series,
          },
        ],
      ];
      this.selectedTimeLabels = [...this.selectedTimeLabels];
    });
  }

  /**
   * Takes in the interday response and generates a series of values to be displayed on the chart
   * @param response response from the interday request
   */
  generateInterDaySeries(response: any[]): any[] {
    return response.map((element: any) => {
      const name: string = element['label'];
      // Include labels for all times in 30 min increments
      if (name.includes('30') || !name.includes(':')) {
        this.selectedTimeLabels.push(name);
      }

      const value = element['average'] === null ? 0 : element['average'];
      return {
        name,
        value,
        volume: element['volume'],
        numberOfTrades: element['numberOfTrades'],
        time: element['minute'],
      };
    });
  }

  /**
   * Takes in the historical series response and generates a series of values to be displayed on the chart
   * @param response response from the historical series request
   */
  generateHistoricalSeries(response: any[]): any[] {
    const interval = Math.ceil(response.length / 9);
    const series = [];
    for (let i = 0; i < response.length; i++) {
      const element = response[i];
      const name: string = element['date'];

      // Makes sure there are at least 10 labels on the x-axis and the last element also has a label
      if (response.length < 9 || i % interval === 0 || i === response.length - 1) {
        this.selectedTimeLabels.push(name);
      }
      const value = element['fClose'] === null ? 0 : element['fClose'];
      const change = element['change'];
      const changePercent = element['changePercent'];
      series.push({
        name,
        value,
        change,
        changePercent,
        volume: element['fVolume'],
        time: element['date'],
      });
    }
    return series;
  }
}

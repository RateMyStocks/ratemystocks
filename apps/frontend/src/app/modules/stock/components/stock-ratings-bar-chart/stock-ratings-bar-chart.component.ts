import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

/**
 * Component showing the user rating stats for a given stock. Uses Highcharts to display the data.
 * {@link https://codesandbox.io/s/oomo7424pz?file=/src/app/chart.component.html:197-231}
 */
@Component({
  selector: 'app-stock-ratings-bar-chart',
  templateUrl: './stock-ratings-bar-chart.component.html',
  styleUrls: ['./stock-ratings-bar-chart.component.scss'],
})
export class StockRatingsBarChartComponent implements OnInit, OnChanges {
  @Input()
  barChartItems: {
    buyRating: { name: string; value: number };
    holdRating: { name: string; value: number };
    sellRating: { name: string; value: number };
  };

  isHighcharts = typeof Highcharts === 'object';
  title = 'UnivHighCharts';
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor = 'chart';
  chartOptions: Highcharts.Options = {};

  initialized = false;

  initialize(): void {
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },
      xAxis: {
        categories: [''],
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: '',
        },
        // max: 1, set max dynamically?
        allowDecimals: false,
      },
      colors: ['#3ac961', '#c98b3a', 'red'],
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: this.barChartItems.buyRating.name,
          data: [this.barChartItems.buyRating.value],
          type: 'column',
        },
        {
          name: this.barChartItems.holdRating.name,
          data: [this.barChartItems.holdRating.value],
          type: 'column',
        },
        {
          name: this.barChartItems.sellRating.name,
          data: [this.barChartItems.sellRating.value],
          type: 'column',
        },
      ],
    };

    this.initialized = true;
  }

  ngOnInit(): void {
    this.initialize();
  }

  /**
   * Should be invoked when client-side routing from one stock page to another stock,
   * or if the chart data changes such as when the user submits a stock rating from the StockPageHeaderComponent.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this.initialized) {
      this.initialize();
    }
  }
}

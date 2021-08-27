import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
// import { Label } from 'ng2-charts';

/**
 * Reusable component utilizing NGX Charts Horizontal Bar Chart
 * {@link https://swimlane.gitbook.io/ngx-charts/examples/bar-charts/horizontal-bar-chart}
 */
@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss'],
})
export class HorizontalBarChartComponent implements OnInit {
  @Input()
  stock: any;

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: string[] = ['Buy', 'Hold', 'Sell'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];
  public chartColors: any[] = [
    {
      backgroundColor: ['green', 'orange', 'red'],
    },
  ];
  public barChartData: ChartDataset[];

  ngOnInit(): void {
    this.barChartData = [{ data: [this.stock.rating.buy, this.stock.rating.hold, this.stock.rating.sell, 0] }];
  }
}

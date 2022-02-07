import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ColorList } from '../../../../shared/utilities/color-list';

@Component({
  selector: 'app-portfolio-breakdown-pie-chart',
  templateUrl: './portfolio-breakdown-pie-chart.component.html',
  styleUrls: ['./portfolio-breakdown-pie-chart.component.scss'],
})
export class PortfolioBreakdownPieChartComponent implements OnInit {
  data: any;

  @Input()
  pieChartItems: { name: string; value: string }[];
  // pieChartItems: PieChartItem[];

  // @Input()
  // dataValues: number[] = [];

  chartOptions: any;

  subscription: Subscription;

  // config: AppConfig;

  // constructor(private configService: AppConfigService) {}
  constructor() {}

  ngOnInit() {
    this.data = {
      labels: this.pieChartItems.map((item) => item.name),
      datasets: [
        {
          data: this.pieChartItems.map((item) => Number.parseFloat(item.value)),
          backgroundColor: ColorList.colors,
          // hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D'],
        },
      ],
    };

    // this.config = this.configService.config;
    this.updateChartOptions();
    // this.subscription = this.configService.configUpdate$.subscribe(config => {
    //     this.config = config;
    //     this.updateChartOptions();
    // });
  }

  updateChartOptions() {
    // this.chartOptions = this.config && this.config.dark ? this.getDarkTheme() : this.getLightTheme();
  }

  getLightTheme() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
    };
  }

  getDarkTheme() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef',
          },
        },
      },
    };
  }
}

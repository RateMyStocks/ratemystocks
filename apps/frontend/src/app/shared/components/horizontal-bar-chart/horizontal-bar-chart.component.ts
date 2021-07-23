import { Component, Input, ChangeDetectorRef, AfterViewInit } from '@angular/core';

/**
 * Reusable component utilizing NGX Charts Horizontal Bar Chart
 * {@link https://swimlane.gitbook.io/ngx-charts/examples/bar-charts/horizontal-bar-chart}
 */
@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss'],
})
export class HorizontalBarChartComponent implements AfterViewInit {
  @Input()
  barChartItems: { name: string; value: number }[];

  // options
  showXAxis = false;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  yAxisLabel = '';
  showYAxisLabel = true;
  xAxisLabel = '';
  xScaleMin = 1;
  showDataLabel = true;
  showAnimations = true;
  showRoundEdges = false;

  colorScheme = {
    domain: ['#34eb5e', '#f5b01b', '#f51b1b', '#AAAAAA'],
  };

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}

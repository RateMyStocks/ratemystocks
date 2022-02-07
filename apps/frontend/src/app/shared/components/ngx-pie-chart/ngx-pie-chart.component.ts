import { Component, ChangeDetectorRef, AfterViewInit, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { PieChartItem } from '../../models/interfaces/pie-chart-item';
import { ColorList } from '../../utilities/color-list';

@Component({
  selector: 'app-ngx-pie-chart',
  templateUrl: './ngx-pie-chart.component.html',
  styleUrls: ['./ngx-pie-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxPieChartComponent implements AfterViewInit {
  @Input()
  pieChartItems: PieChartItem[];

  // NGX Charts options
  gradient = true;
  showLegend = true;
  showLabels = true;
  isDoughnut = true;
  legendPosition = 'below'; // also can be 'right'

  colorScheme = {
    domain: ColorList.colors,
  };

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  /**
   * Formats the tooltip text that appears when hovering over a pie chart slice.
   * @param item Object containing data representing the pie chart slice.
   * @returns The formatted tooltip text - the pie chart slice value as a percentage.
   */
  tooltipText(item: any): string {
    return item.value + '%';
  }
}

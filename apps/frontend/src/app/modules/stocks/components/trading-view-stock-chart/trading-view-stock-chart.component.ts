import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';

declare const TradingView: any;

/**
 * Angular Wrapper for the TradingView Stock Chart Widget.
 * {@link https://www.tradingview.com/widget/advanced-chart/}
 */
@Component({
  selector: 'app-trading-view-stock-chart',
  templateUrl: './trading-view-stock-chart.component.html',
  styleUrls: ['./trading-view-stock-chart.component.scss']
})
export class TradingViewStockChartComponent implements AfterViewInit, OnChanges {
  @Input() ticker!: string;
  @Input() exchange!: string;

  ngAfterViewInit(): void {
    this.createStockChartWidget();
  }

  ngOnChanges(): void {
    this.createStockChartWidget();
  }

  createStockChartWidget(): void {
    // IEX Cloud API returns exchanges in a different format than how Trading View needs
    const exchange = this.exchange === 'NEW YORK STOCK EXCHANGE INC.' ? 'NYSE' : this.exchange;

    new TradingView.widget({
      "height": 400,
      "symbol": `${exchange}:${this.ticker}`,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "light",
      "style": "1",
      "locale": "en",
      "toolbar_bg": "#f1f3f6",
      "enable_publishing": false,
      "withdateranges": true,
      "range": "1D",
      "container_id": "tradingview_191df"
    });
  }
}

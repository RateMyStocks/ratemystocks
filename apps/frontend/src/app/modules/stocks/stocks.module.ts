import { NgModule } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { StocksComponent } from './pages/stocks/stocks.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrimeNGModule } from '../../primeng.module';
import { SharedModule } from '../../shared/shared.module';
import { StocksRoutingModule } from './stocks-routing.module';
import { StockComponent } from './pages/stock/stock.component';
import { StockPerformanceChartComponent } from './components/stock-performance-chart/stock-performance-chart.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { TradingViewStockChartComponent } from './components/trading-view-stock-chart/trading-view-stock-chart.component';

@NgModule({
  declarations: [StocksComponent, StockComponent, StockPerformanceChartComponent, TradingViewStockChartComponent],
  imports: [
    ClipboardModule,
    CommonModule,
    FormsModule,
    HighchartsChartModule,
    HttpClientModule,
    PrimeNGModule,
    SharedModule,
    StocksRoutingModule,
  ],
})
export class StocksModule {}

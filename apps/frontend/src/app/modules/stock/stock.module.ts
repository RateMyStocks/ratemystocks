import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockComponent } from './pages/stock/stock.component';
import { StocksComponent } from './pages/stocks/stocks.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../../shared/shared.module';
import { StockPerformanceChartComponent } from './components/stock-performance-chart/stock-performance-chart.component';
import { StockPageHeaderComponent } from './components/stock-page-header/stock-page-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StockNewsFeedComponent } from './components/stock-news-feed/stock-news-feed.component';
import { StockCompanyInfoComponent } from './components/stock-company-info/stock-company-info.component';
import { StockKeyStatsComponent } from './components/stock-key-stats/stock-key-stats.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HighchartsChartModule } from 'highcharts-angular';
import { StockRatingsBarChartComponent } from './components/stock-ratings-bar-chart/stock-ratings-bar-chart.component';
import { StocksTableComponent } from './components/stocks-table/stocks-table.component';
import { RouterModule } from '@angular/router';
import { StockRoutingModule } from './stock-routing.module';
import { AngularMaterialModule } from '../../angular-material.module';

@NgModule({
  declarations: [
    StockComponent,
    StocksComponent,
    StockPerformanceChartComponent,
    StockPageHeaderComponent,
    StockNewsFeedComponent,
    StockCompanyInfoComponent,
    StockKeyStatsComponent,
    StockRatingsBarChartComponent,
    StocksTableComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HighchartsChartModule,
    FormsModule,
    NgxChartsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    StockRoutingModule,
  ],
})
export class StockModule {}

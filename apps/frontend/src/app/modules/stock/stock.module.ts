import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { StockComponent } from './pages/stock/stock.component';
import { StocksComponent } from './pages/stocks/stocks.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../../shared/shared.module';
import { StockPerformanceChartComponent } from './components/stock-performance-chart/stock-performance-chart.component';
import { StockPageHeaderComponent } from './components/stock-page-header/stock-page-header.component';
import { FormsModule } from '@angular/forms';
import { StockNewsFeedComponent } from './components/stock-news-feed/stock-news-feed.component';
import { StockCompanyInfoComponent } from './components/stock-company-info/stock-company-info.component';
import { StockKeyStatsComponent } from './components/stock-key-stats/stock-key-stats.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    StockComponent,
    StocksComponent,
    StockPerformanceChartComponent,
    StockPageHeaderComponent,
    StockNewsFeedComponent,
    StockCompanyInfoComponent,
    StockKeyStatsComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    NgxChartsModule,
    SharedModule,
  ],
})
export class StockModule {}

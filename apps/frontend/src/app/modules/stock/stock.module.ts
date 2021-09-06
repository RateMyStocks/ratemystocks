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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StockNewsFeedComponent } from './components/stock-news-feed/stock-news-feed.component';
import { StockCompanyInfoComponent } from './components/stock-company-info/stock-company-info.component';
import { StockKeyStatsComponent } from './components/stock-key-stats/stock-key-stats.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { HighchartsChartModule } from 'highcharts-angular';
import { StockRatingsBarChartComponent } from './components/stock-ratings-bar-chart/stock-ratings-bar-chart.component';
import { StocksTableComponent } from './components/stocks-table/stocks-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HighchartsChartModule,
    FormsModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatTabsModule,
    MatTooltipModule,
    NgxChartsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
  ],
})
export class StockModule {}

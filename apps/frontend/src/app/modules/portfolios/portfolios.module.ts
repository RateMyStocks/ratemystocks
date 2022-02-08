import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfoliosComponent } from './pages/portfolios/portfolios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PortfolioRoutingModule } from './portfolios-routing.module';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { AppCodeModule } from '../../app.code.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PrimeNGModule } from '../../primeng.module';
import { SharedModule } from '../../shared/shared.module';
import { PortfoliosTableComponent } from './components/portfolios-table/portfolios-table.component';
import { PortfolioBreakdownPieChartComponent } from './components/portfolio-breakdown-pie-chart/portfolio-breakdown-pie-chart.component';
import { PortfolioHoldingsTableReadonlyComponent } from './components/portfolio-holdings-table-readonly/portfolio-holdings-table-readonly.component';

@NgModule({
  declarations: [
    PortfoliosComponent,
    PortfolioComponent,
    PortfolioHoldingsTableReadonlyComponent,
    PortfoliosTableComponent,
    PortfolioBreakdownPieChartComponent,
    // TODO: Don't forget to declare these once they are fixed up
    // PortfoliosTableComponent,
    // UpdatePortfolioNameDialogComponent,
    // UpdatePortfolioDescriptionDialogComponent,
    // UpdatePortfolioHoldingsDialogComponent,
  ],
  imports: [
    AppCodeModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgxChartsModule,
    PortfolioRoutingModule,
    PrimeNGModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class PortfoliosModule {}

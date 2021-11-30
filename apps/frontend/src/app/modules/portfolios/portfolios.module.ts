import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfoliosComponent } from './pages/portfolios/portfolios.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PortfolioRoutingModule } from './portfolios-routing.module';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { AppCodeModule } from '../../app.code.component';
import { PrimeNGModule } from '../../primeng.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PortfoliosComponent,
    PortfolioComponent,
    // TODO: Don't forget to declare these once they are fixed up
    // CreatePortfolioDialogComponent,
    // PortfolioHoldingsTableComponent,
    // PortfolioHoldingsTableReadonlyComponent,
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
    PortfolioRoutingModule,
    PrimeNGModule,
    SharedModule,
  ],
})
export class PortfoliosModule {}

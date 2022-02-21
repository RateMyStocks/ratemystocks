import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PortfolioResolver } from '../../core/resolvers/portfolio.resolver';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { PortfoliosComponent } from './pages/portfolios/portfolios.component';

export const PORTFOLIO_ROUTES = [
  { path: '', component: PortfoliosComponent },
  { path: ':id', component: PortfolioComponent, resolve: { portfolio: PortfolioResolver } },
];

@NgModule({
  imports: [RouterModule.forChild(PORTFOLIO_ROUTES)],
  exports: [RouterModule],
})
export class PortfolioRoutingModule {}

import { PortfoliosComponent } from './pages/portfolios/portfolios.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';

export const PORTFOLIO_ROUTES = [
  { path: '', component: PortfoliosComponent },
  { path: ':id', component: PortfolioComponent },
];

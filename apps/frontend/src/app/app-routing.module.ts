import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './modules/home/pages/home/home.component';
import { STOCKS_ROUTES } from './modules/stock/stock.routes';
import { PORTFOLIO_ROUTES } from './modules/portfolio/portfolio.routes';
import { PortfoliosComponent } from './modules/portfolio/pages/portfolios/portfolios.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: PortfoliosComponent,
      },
      // {
      //   path: 'auth/:mode',
      //   component: LoginComponent,
      // },
      {
        path: 'stocks',
        children: STOCKS_ROUTES,
      },
      {
        path: 'portfolios',
        children: PORTFOLIO_ROUTES,
      },
    ],
  },
  // {
  //   path: '',
  //   component: PortfoliosComponent,
  // },
  // {
  //   path: 'stocks',
  //   children: STOCKS_ROUTES,
  // },
  // {
  //   path: 'portfolios',
  //   children: PORTFOLIO_ROUTES,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

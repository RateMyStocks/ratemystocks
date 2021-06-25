import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { STOCKS_ROUTES } from './modules/stock/stock.routes';
import { PORTFOLIO_ROUTES } from './modules/portfolio/portfolio.routes';
import { RESOURCES_ROUTES } from './modules/resources/resources.routes';
import { PROFILE_ROUTES } from './modules/profile/profile.routes';
import { LOGIN_ROUTES } from './modules/login/login.routes';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/portfolios',
    pathMatch: 'full',
  },
  {
    path: 'stocks',
    children: STOCKS_ROUTES,
  },
  {
    path: 'portfolios',
    children: PORTFOLIO_ROUTES,
  },
  {
    path: 'auth',
    children: LOGIN_ROUTES,
  },
  {
    path: '',
    children: PROFILE_ROUTES,
  },
  {
    path: '',
    children: RESOURCES_ROUTES,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

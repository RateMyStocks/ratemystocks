import { NgModule } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';
import { STOCKS_ROUTES } from './modules/stock/stock.routes';
import { PORTFOLIO_ROUTES } from './modules/portfolio/portfolio.routes';
import { RESOURCES_ROUTES } from './modules/resources/resources.routes';
import { PROFILE_ROUTES } from './modules/profile/profile.routes';
import { LOGIN_ROUTES } from './modules/login/login.routes';
import { NotFoundComponent } from './modules/error/not-found/not-found.component';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

// TODO: Until official launch, we are just going to show a "Coming Soon" page on production (so no need for redirect on production).
const homeRoute: Route = environment.production
  ? { path: '', component: AppComponent }
  : {
      path: '',
      redirectTo: '/portfolios',
      pathMatch: 'full',
    };

const routes: Routes = [
  homeRoute,
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
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

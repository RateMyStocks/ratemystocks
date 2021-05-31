import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { STOCKS_ROUTES } from './modules/stock/stock.routes';
import { PORTFOLIO_ROUTES } from './modules/portfolio/portfolio.routes';
import { LoginComponent } from './modules/login/pages/login.component';
import { RESOURCES_ROUTES } from './modules/resources/resources.routes';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/portfolios',
    pathMatch: 'full',
  },
  {
    path: 'auth/:mode',
    component: LoginComponent,
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
    path: '',
    children: RESOURCES_ROUTES,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

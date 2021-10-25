import { NgModule } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';
import { RESOURCES_ROUTES } from './modules/resources/resources.routes';
import { NotFoundComponent } from './modules/error/not-found/not-found.component';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

// TODO: Until official launch, we are just going to show a "Coming Soon" page on production (so no need for redirect on production).
const homeRoute: Route = environment.production
  ? { path: '', component: AppComponent }
  : {
      path: '',
      redirectTo: '/stocks',
      pathMatch: 'full',
    };

const routes: Routes = [
  homeRoute,
  {
    path: 'stocks',
    loadChildren: () => import('./modules/stock/stock.module').then((m) => m.StockModule),
  },
  {
    path: 'portfolios',
    loadChildren: () => import('./modules/portfolio/portfolio.module').then((m) => m.PortfolioModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '',
    loadChildren: () => import('./modules/profile/profile.module').then((m) => m.ProfileModule),
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

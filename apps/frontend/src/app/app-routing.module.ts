import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RESOURCES_ROUTES } from './modules/resources/resources.routes';
import { NotFoundComponent } from './modules/error/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/stocks',
    pathMatch: 'full',
  },
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

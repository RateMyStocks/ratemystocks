import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { AppLoginComponent } from './pages/app.login.component';
import { AppHelpComponent } from './pages/app.help.component';
import { AppResetPasswordComponent } from './pages/app.resetpassword.component';
import { ResetPasswordLinkGuard } from './core/guards/reset-password-link.guard';
import { AppSignupComponent } from './pages/app.signup.component';
import { AppForgotPasswordComponent } from './pages/app.forgotpassword.component';

const routes: Routes = [
  {
    path: '',
    component: AppMainComponent,
    children: [
      {
        path: '',
        redirectTo: '/stocks',
        pathMatch: 'full',
      },
      {
        path: 'stocks',
        loadChildren: () => import('./modules/stocks/stocks.module').then((m) => m.StocksModule),
      },
      {
        path: 'portfolios',
        loadChildren: () => import('./modules/portfolios/portfolios.module').then((m) => m.PortfoliosModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./modules/profile/profile.module').then((m) => m.ProfileModule),
      },
      { path: 'resources/help', component: AppHelpComponent },
    ],
  },
  // { path: 'error', component: AppErrorComponent },
  // { path: 'access', component: AppAccessdeniedComponent },
  { path: 'notfound', component: AppNotfoundComponent },
  { path: 'login', component: AppLoginComponent },
  { path: 'signup', component: AppSignupComponent },
  { path: 'forgotpassword', component: AppForgotPasswordComponent },
  { path: 'resetpassword/:userid/:token', component: AppResetPasswordComponent, canActivate: [ResetPasswordLinkGuard] },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

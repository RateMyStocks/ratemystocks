import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ResetPasswordLinkGuard } from '../../core/guards/reset-password-link.guard';

export const LOGIN_ROUTES: Route[] = [
  { path: 'signin', component: LoginComponent },
  { path: 'register', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'resetpassword/:userid/:token', component: ResetPasswordComponent, canActivate: [ResetPasswordLinkGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(LOGIN_ROUTES)],
  providers: [ResetPasswordLinkGuard],
  exports: [RouterModule],
})
export class LoginRoutingModule {}

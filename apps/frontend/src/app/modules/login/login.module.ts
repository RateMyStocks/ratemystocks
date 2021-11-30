import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthFormContainerComponent } from './components/auth-form-container/auth-form-container.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { LoginRoutingModule } from './login-routing.module';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { PrimeNGModule } from '../../primeng.module';

@NgModule({
  declarations: [
    AuthFormContainerComponent,
    LoginComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    AuthFormComponent,
    ResetPasswordComponent,
  ],
  imports: [PrimeNGModule, CommonModule, FormsModule, LoginRoutingModule, ReactiveFormsModule, RouterModule],
})
export class LoginModule {}

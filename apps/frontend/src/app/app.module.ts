import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppCodeModule } from './app.code.component';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { AppConfigComponent } from './app.config.component';
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';
import { AppRightPanelComponent } from './app.rightpanel.component';
import { AppBreadcrumbComponent } from './app.breadcrumb.component';
import { AppFooterComponent } from './app.footer.component';
import { AppHelpComponent } from './pages/app.help.component';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { AppErrorComponent } from './pages/app.error.component';
import { AppAccessdeniedComponent } from './pages/app.accessdenied.component';
import { AppLoginComponent } from './pages/app.login.component';
import { AppResetPasswordComponent } from './pages/app.resetpassword.component';

import { MenuService } from './app.menu.service';
import { AppBreadcrumbService } from './app.breadcrumb.service';

import { CoreModule } from './core/core.module';
import { PrimeNGModule } from './primeng.module';
import { AppTopBarComponent } from './app.topbar.component';
import { SharedModule } from './shared/shared.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ResetPasswordLinkGuard } from './core/guards/reset-password-link.guard';

import { HighchartsChartModule } from 'highcharts-angular';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error-interceptor';
import { GlobalErrorHandler } from './core/error-handlers/global-error-handler';
import { AppStockNewsBarComponent } from './app.stocknewsbar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppSignupComponent } from './pages/app.signup.component';
import { AppForgotPasswordComponent } from './pages/app.forgotpassword.component';

FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, interactionPlugin]);

@NgModule({
  imports: [
    AppCodeModule,
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    CoreModule,
    FormsModule,
    FullCalendarModule,
    HighchartsChartModule,
    HttpClientModule,
    PrimeNGModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    AppComponent,
    AppMainComponent,
    AppConfigComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppRightPanelComponent,
    AppBreadcrumbComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppForgotPasswordComponent,
    AppLoginComponent,
    AppSignupComponent,
    AppHelpComponent,
    AppNotfoundComponent,
    AppErrorComponent,
    AppAccessdeniedComponent,
    AppResetPasswordComponent,
    AppStockNewsBarComponent,
  ],
  providers: [
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    AppBreadcrumbService,
    ConfirmationService,
    MenuService,
    MessageService,
    ResetPasswordLinkGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { StockModule } from './modules/stock/stock.module';
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './modules/login/login.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    CoreModule,
    HttpClientModule,
    LoginModule,
    PortfolioModule,
    StockModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

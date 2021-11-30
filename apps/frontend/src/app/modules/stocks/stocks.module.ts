import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StocksComponent } from './pages/stocks/stocks.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrimeNGModule } from '../../primeng.module';
import { SharedModule } from '../../shared/shared.module';
import { StocksRoutingModule } from './stocks-routing.module';
import { StockComponent } from './pages/stock/stock.component';

@NgModule({
  declarations: [StocksComponent, StockComponent],
  imports: [CommonModule, FormsModule, HttpClientModule, PrimeNGModule, SharedModule, StocksRoutingModule],
})
export class StocksModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockComponent } from './pages/stock/stock.component';
import { StocksComponent } from './pages/stocks/stocks.component';



@NgModule({
  declarations: [
    StockComponent,
    StocksComponent
  ],
  imports: [
    CommonModule
  ]
})
export class StockModule { }

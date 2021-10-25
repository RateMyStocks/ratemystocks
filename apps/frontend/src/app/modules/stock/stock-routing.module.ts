import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StockComponent } from './pages/stock/stock.component';
import { StocksComponent } from './pages/stocks/stocks.component';

export const STOCKS_ROUTES = [
  { path: ':ticker', component: StockComponent },
  { path: '', component: StocksComponent },
];

@NgModule({
  imports: [RouterModule.forChild(STOCKS_ROUTES)],
  exports: [RouterModule],
})
export class StockRoutingModule {}

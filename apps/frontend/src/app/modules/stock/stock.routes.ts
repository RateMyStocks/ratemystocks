// import { StockRatingComponent } from './pages/stock-rating/stock-rating.component';
import { StockComponent } from './pages/stock/stock.component';
import { StocksComponent } from './pages/stocks/stocks.component';

export const STOCKS_ROUTES = [
  { path: ':ticker', component: StockComponent },
  { path: '', component: StocksComponent },
];

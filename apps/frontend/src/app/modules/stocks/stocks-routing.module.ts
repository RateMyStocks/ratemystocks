import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { StockResolver } from "../../core/resolvers/stock.resolver";
import { StockComponent } from "./pages/stock/stock.component";
import { StocksComponent } from "./pages/stocks/stocks.component";

export const STOCKS_ROUTES = [
    { path: "", component: StocksComponent},
    { path: ":ticker", component: StockComponent, resolve: { stock: StockResolver }  },
];

@NgModule({
    imports: [RouterModule.forChild(STOCKS_ROUTES)],
    exports: [RouterModule],
})
export class StocksRoutingModule {}

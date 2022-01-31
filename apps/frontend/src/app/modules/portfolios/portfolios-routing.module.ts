import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PortfolioComponent } from "./pages/portfolio/portfolio.component";
import { PortfoliosComponent } from "./pages/portfolios/portfolios.component";

export const PORTFOLIO_ROUTES = [
    { path: "", component: PortfoliosComponent },
    { path: ":id", component: PortfolioComponent },
];

@NgModule({
    imports: [RouterModule.forChild(PORTFOLIO_ROUTES)],
    exports: [RouterModule],
})
export class PortfolioRoutingModule {}

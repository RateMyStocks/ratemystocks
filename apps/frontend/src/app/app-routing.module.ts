import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AppMainComponent } from "./app.main.component";
import { AppNotfoundComponent } from "./pages/app.notfound.component";
import { AppErrorComponent } from "./pages/app.error.component";
import { AppAccessdeniedComponent } from "./pages/app.accessdenied.component";
import { AppLoginComponent } from "./pages/app.login.component";
import { AppHelpComponent } from "./pages/app.help.component";

const routes: Routes = [
    {
        path: "",
        component: AppMainComponent,
        children: [
            // { path: "", component: DashboardDemoComponent },
            {
                path: "",
                redirectTo: "/stocks",
                pathMatch: "full",
            },
            {
                path: "stocks",
                loadChildren: () =>
                    import("./modules/stocks/stocks.module").then(
                        (m) => m.StocksModule
                    ),
            },
            {
                path: "portfolios",
                loadChildren: () =>
                    import("./modules/portfolios/portfolios.module").then(
                        (m) => m.PortfoliosModule
                    ),
            },
            {
                path: "profile",
                loadChildren: () =>
                    import("./modules/profile/profile.module").then(
                        (m) => m.ProfileModule
                    ),
            },
            { path: "pages/help", component: AppHelpComponent },
        ],
    },
    { path: "error", component: AppErrorComponent },
    { path: "access", component: AppAccessdeniedComponent },
    { path: "notfound", component: AppNotfoundComponent },
    { path: "login", component: AppLoginComponent },
    { path: "**", redirectTo: "/notfound" },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled" }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";

import { AppCodeModule } from "./app.code.component";
import { AppComponent } from "./app.component";
import { AppMainComponent } from "./app.main.component";
import { AppConfigComponent } from "./app.config.component";
import { AppMenuComponent } from "./app.menu.component";
import { AppMenuitemComponent } from "./app.menuitem.component";
import { AppRightPanelComponent } from "./app.rightpanel.component";
import { AppBreadcrumbComponent } from "./app.breadcrumb.component";
import { AppFooterComponent } from "./app.footer.component";
import { AppHelpComponent } from "./pages/app.help.component";
import { AppNotfoundComponent } from "./pages/app.notfound.component";
import { AppErrorComponent } from "./pages/app.error.component";
import { AppAccessdeniedComponent } from "./pages/app.accessdenied.component";
import { AppLoginComponent } from "./pages/app.login.component";

import { MenuService } from "./app.menu.service";
import { AppBreadcrumbService } from "./app.breadcrumb.service";

import { CoreModule } from "./core/core.module";
import { PrimeNGModule } from "./primeng.module";
import { AppTopBarComponent } from "./app.topbar.component";
import { SharedModule } from "./shared/shared.module";

@NgModule({
    imports: [
        AppCodeModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        CoreModule,
        FormsModule,
        HttpClientModule,
        PrimeNGModule,
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
        AppLoginComponent,
        AppHelpComponent,
        AppNotfoundComponent,
        AppErrorComponent,
        AppAccessdeniedComponent,
    ],
    providers: [
        // { provide: LocationStrategy, useClass: HashLocationStrategy },
        MenuService,
        AppBreadcrumbService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}

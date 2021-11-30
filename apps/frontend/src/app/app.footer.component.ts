import { Component } from "@angular/core";
import { AppComponent } from "./app.component";

@Component({
    selector: "app-footer",
    template: `
        <div class="layout-footer">
            <a id="footerlogolink">
                <img
                    id="footer-logo"
                    [style]="{ height: '32px', width: 'auto' }"
                    [src]="
                        'assets/layout/images/logo-' +
                        (app.layoutMode === 'light'
                            ? 'ratemystocks'
                            : 'ratemystocks-dark-theme') +
                        '.png'
                    "
                />
            </a>
            <div class="social-icons">
                <a><i class="pi pi-github"></i></a>
                <a><i class="pi pi-facebook"></i></a>
                <a><i class="pi pi-twitter"></i></a>
            </div>
        </div>
    `,
})
export class AppFooterComponent {
    constructor(public app: AppComponent) {}
}

import { Component } from '@angular/core';
import {AppBreadcrumbService} from '../app.breadcrumb.service';

@Component({
    templateUrl: './app.help.component.html',
})
export class AppHelpComponent {
    text: any;

    constructor(private breadcrumbService: AppBreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Pages' },
            { label: 'Help', routerLink: ['/pages/help'] }
        ]);
    }
}

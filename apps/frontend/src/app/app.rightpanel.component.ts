import {Component} from '@angular/core';
import {AppMainComponent} from './app.main.component';

@Component({
    selector: 'app-rightpanel',
    templateUrl: './app.rightpanel.component.html'
})
export class AppRightPanelComponent {
    checked1 = true;

    checked2 = true;

    checked3 = false;

    checked4 = false;

    checked5 = false;

    checked6 = false;

    checked7 = false;

    checked8 = false;

    constructor(public app: AppMainComponent) {
    }
}

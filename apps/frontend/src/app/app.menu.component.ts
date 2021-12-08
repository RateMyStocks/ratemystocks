import { Component, OnInit } from '@angular/core';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-menu',
  template: `
    <ul class="layout-menu">
      <li app-menuitem *ngFor="let item of model; let i = index" [item]="item" [index]="i" [root]="true"></li>
    </ul>
  `,
})
export class AppMenuComponent implements OnInit {
  model!: any[];

  constructor(public app: AppComponent) {}

  ngOnInit() {
    this.model = [
      {
        label: 'Main',
        icon: 'pi pi-fw pi-home',
        items: [
          // {
          //     label: "Home",
          //     icon: "pi pi-fw pi-home",
          //     routerLink: ["/"],
          // },
          {
            label: 'Stocks',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: ['/stocks'],
          },
          {
            label: 'Portfolios',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: ['/portfolios'],
          },
        ],
      },
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-star',
        routerLink: ['/proifle'],
        items: [
          {
            label: 'My Profile',
            icon: 'pi pi-fw pi-user',
            routerLink: ['/profile/users/someuser'],
          },
          {
            label: 'Favorites',
            icon: 'pi pi-fw pi-heart',
            routerLink: ['/profile/favorites'],
          },
          {
            label: 'Settings',
            icon: 'pi pi-fw pi-cog',
            routerLink: ['/profile/settings'],
          },
        ],
      },
      {
        label: 'Resources',
        icon: 'pi pi-fw pi-compass',
        routerLink: ['utilities'],
        items: [
          {
            label: 'Help',
            icon: 'pi pi-fw pi-question-circle',
            routerLink: ['pages/help'],
          },
        ],
      },
      // {
      //     label: "Hierarchy",
      //     icon: "pi pi-fw pi-align-left",
      //     items: [
      //         {
      //             label: "Submenu 1",
      //             icon: "pi pi-fw pi-align-left",
      //             items: [
      //                 {
      //                     label: "Submenu 1.1",
      //                     icon: "pi pi-fw pi-align-left",
      //                     items: [
      //                         {
      //                             label: "Submenu 1.1.1",
      //                             icon: "pi pi-fw pi-align-left",
      //                         },
      //                         {
      //                             label: "Submenu 1.1.2",
      //                             icon: "pi pi-fw pi-align-left",
      //                         },
      //                         {
      //                             label: "Submenu 1.1.3",
      //                             icon: "pi pi-fw pi-align-left",
      //                         },
      //                     ],
      //                 },
      //                 {
      //                     label: "Submenu 1.2",
      //                     icon: "pi pi-fw pi-align-left",
      //                     items: [
      //                         {
      //                             label: "Submenu 1.2.1",
      //                             icon: "pi pi-fw pi-align-left",
      //                         },
      //                     ],
      //                 },
      //             ],
      //         },
      //         {
      //             label: "Submenu 2",
      //             icon: "pi pi-fw pi-align-left",
      //             items: [
      //                 {
      //                     label: "Submenu 2.1",
      //                     icon: "pi pi-fw pi-align-left",
      //                     items: [
      //                         {
      //                             label: "Submenu 2.1.1",
      //                             icon: "pi pi-fw pi-align-left",
      //                         },
      //                         {
      //                             label: "Submenu 2.1.2",
      //                             icon: "pi pi-fw pi-align-left",
      //                         },
      //                     ],
      //                 },
      //                 {
      //                     label: "Submenu 2.2",
      //                     icon: "pi pi-fw pi-align-left",
      //                     items: [
      //                         {
      //                             label: "Submenu 2.2.1",
      //                             icon: "pi pi-fw pi-align-left",
      //                         },
      //                     ],
      //                 },
      //             ],
      //         },
      //     ],
      // },
    ];
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  styles: [
    `
      :host ::ng-deep .p-datatable-gridlines p-progressBar {
        width: 100%;
      }
      @media screen and (max-width: 960px) {
        :host ::ng-deep .p-datatable.p-datatable-customers.rowexpand-table .p-datatable-tbody > tr > td:nth-child(6) {
          display: flex;
        }
      }
    `,
  ],
})
export class FavoritesComponent {
  constructor(private breadcrumbService: AppBreadcrumbService) {
    this.breadcrumbService.setItems([{ label: 'Profile' }, { label: 'Favorites', routerLink: ['/profile/favorites'] }]);
  }
}

// import { Component, OnInit } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../../core/services/auth.service';
// import { CreatePortfolioDialogComponent } from '../../components/create-portfolio-dialog/create-portfolio-dialog.component';

// @Component({
//   selector: 'app-portfolios',
//   templateUrl: './portfolios.component.html',
//   styleUrls: ['./portfolios.component.scss'],
// })
// export class PortfoliosComponent {
//   constructor(
//     public dialog: MatDialog,
//     private authService: AuthService,
//     private router: Router,
//     private snackBar: MatSnackBar
//   ) {}

//   openDialog() {
//     if (this.authService.isAuthorized()) {
//       const dialogRef = this.dialog.open(CreatePortfolioDialogComponent);
//       dialogRef.afterClosed().subscribe((result: any) => {
//         console.log(`Dialog result: ${result}`);
//       });
//     } else {
//       this.router.navigate(['/auth/signin']);
//       this.snackBar.open('You must be signed in to use this feature.', 'OK', {
//         duration: 3000,
//         panelClass: 'warn-snackbar',
//       });
//     }
//   }
// }

import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ProductService } from '../../../../core/services/productservice';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
import { Customer, Representative } from '../../../../shared/models/customer';
import { Product } from '../../../../shared/models/product';
import { CustomerService } from '../../../../core/services/customerservice';

@Component({
  selector: 'app-stocks',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.scss'],
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
export class PortfoliosComponent implements OnInit {
  customers1: Customer[];

  customers2: Customer[];

  customers3: Customer[];

  selectedCustomers1: Customer[];

  selectedCustomer: Customer;

  representatives: Representative[];

  statuses: any[];

  products: Product[];

  rowGroupMetadata: any;

  activityValues: number[] = [0, 100];

  @ViewChild('dt') table: Table;

  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private breadcrumbService: AppBreadcrumbService
  ) {
    this.breadcrumbService.setItems([{ label: 'Home' }, { label: 'Portfolios', routerLink: ['/uikit/table'] }]);
  }

  ngOnInit() {
    this.customerService.getCustomersLarge().then((customers) => {
      this.customers1 = customers;
      // @ts-ignore
      this.customers1.forEach((customer) => (customer.date = new Date(customer.date).toDateString()));
    });
    this.customerService.getCustomersMedium().then((customers) => (this.customers2 = customers));
    this.customerService.getCustomersMedium().then((customers) => (this.customers3 = customers));
    this.productService.getProductsWithOrdersSmall().then((data) => (this.products = data));

    this.representatives = [
      { name: 'Amy Elsner', image: 'amyelsner.png' },
      { name: 'Anna Fali', image: 'annafali.png' },
      { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
      { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
      { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
      { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
      { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
      { name: 'Onyama Limba', image: 'onyamalimba.png' },
      { name: 'Stephen Shaw', image: 'stephenshaw.png' },
      { name: 'XuXue Feng', image: 'xuxuefeng.png' },
    ];

    this.statuses = [
      { label: 'Unqualified', value: 'unqualified' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'New', value: 'new' },
      { label: 'Negotiation', value: 'negotiation' },
      { label: 'Renewal', value: 'renewal' },
      { label: 'Proposal', value: 'proposal' },
    ];
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};

    if (this.customers3) {
      for (let i = 0; i < this.customers3.length; i++) {
        const rowData = this.customers3[i];
        const representativeName = rowData.representative.name;

        if (i === 0) {
          this.rowGroupMetadata[representativeName] = {
            index: 0,
            size: 1,
          };
        } else {
          const previousRowData = this.customers3[i - 1];
          const previousRowGroup = previousRowData.representative.name;
          if (representativeName === previousRowGroup) {
            this.rowGroupMetadata[representativeName].size++;
          } else {
            this.rowGroupMetadata[representativeName] = {
              index: i,
              size: 1,
            };
          }
        }
      }
    }
  }
}

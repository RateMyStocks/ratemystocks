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
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
import { Meta, Title } from '@angular/platform-browser';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { AuthService } from '../../../../core/services/auth.service';

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
  constructor(
    private authService: AuthService,
    private portfolioService: PortfolioService,
    private breadcrumbService: AppBreadcrumbService,
    private meta: Meta,
    private title: Title
  ) {
    this.title.setTitle(`Portfolios | ratemystocks.com`);
    this.meta.addTags([
      {
        name: 'description',
        content: `View sample portfolios from investors around the world or create your own to get feedback and insights into your holdings.`,
      },
      {
        name: 'keywords',
        content: `stock portfolio tracker, stock portfolio backtesting, stock portfolio analyzer, stock portfolio feedback, stock portfolio insights`,
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ]);

    this.breadcrumbService.setItems([{ label: 'Home' }, { label: 'Portfolios', routerLink: ['/uikit/table'] }]);
  }

  ngOnInit() {}
}

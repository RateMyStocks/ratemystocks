import { ChangeDetectorRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { UserPortfolioDto, UserProfileDto } from '@ratemystocks/api-interface';
import { AuthService } from '../../../../core/services/auth.service';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import moment = require('moment');
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-user-portfolios-table',
  templateUrl: './user-portfolios-table.component.html',
  styleUrls: ['./user-portfolios-table.component.scss'],
})
export class UserPortfoliosTableComponent implements OnInit, OnDestroy {
  isAuth: boolean;
  authStatusSub: Subscription;
  loggedInUserId: string;

  @Input() user: UserProfileDto;

  displayedColumns: string[] = [
    'name',
    'num_likes',
    'num_dislikes',
    'num_holdings',
    'largest_holding',
    'last_updated',
    'actions',
  ];
  dataSource = null;

  moment = moment;

  portfoliosLoaded = false;

  constructor(
    private portfolioService: PortfolioService,
    private authService: AuthService,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    private changeDetectorRefs: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isAuth = this.authService.isAuthorized();
    this.loggedInUserId = this.authService.getUserId();

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuth = authStatus;
      if (this.isAuth) {
        this.loggedInUserId = this.authService.getUserId();
      }
    });

    this.portfolioService.getPortfoliosByUserId(this.user.id).subscribe((portfolios: UserPortfolioDto[]) => {
      this.portfoliosLoaded = true;

      this.dataSource = portfolios;
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  /**
   * Deletes a Portfolio by it's unique id when the delete button in the row is clicked.
   * @param portfolioId The UUID of the portfolio to delete.
   */
  onClickDeletePortfolioButton(portfolioId: string): void {
    if (this.isAuth && this.user.id === this.loggedInUserId) {
      const dialogData: ConfirmDialogModel = {
        title: 'Delete Portfolio',
        message: 'Are you sure you want to delete this portfolio?',
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '500px',
        data: dialogData,
      });
      dialogRef.afterClosed().subscribe((isConfirmed: boolean) => {
        if (isConfirmed) {
          this.portfolioService.deletePortfolioById(portfolioId).subscribe(() => {
            this.refreshPortfoliosTable();
          });

          this.snackbar.open(`Portfolio deleted!`, 'OK', {
            duration: 2000,
            panelClass: 'success-snackbar',
          });
        }
      });
    }
  }

  /** Refreshes the table by re-fetching the portfolios from the backend. */
  refreshPortfoliosTable(): void {
    this.portfolioService.getPortfoliosByUserId(this.user.id).subscribe((portfolios: UserPortfolioDto[]) => {
      this.dataSource = portfolios;
      this.changeDetectorRefs.detectChanges();
    });
  }
}

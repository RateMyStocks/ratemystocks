import { ViewChild } from '@angular/core';
import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { PortfolioHoldingsTableComponent } from '../portfolio-holdings-table/portfolio-holdings-table.component';
import * as _ from 'lodash';
import { PortfolioDto, PortfolioStockDto } from '@ratemystocks/api-interface';

@Component({
  selector: 'app-update-portfolio-holdings-dialog',
  templateUrl: './update-portfolio-holdings-dialog.component.html',
  styleUrls: ['./update-portfolio-holdings-dialog.component.scss'],
})
export class UpdatePortfolioHoldingsDialogComponent implements OnInit {
  portfolioForm: FormGroup;

  @ViewChild('portfolioTable') portfolioTable: PortfolioHoldingsTableComponent;

  portfolioStocks: PortfolioStockDto[];

  constructor(
    private portfolioService: PortfolioService,
    public dialogRef: MatDialogRef<UpdatePortfolioHoldingsDialogComponent>,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Clone/copy the portfolioStocks since this array is passed down from the parent component, and since arrays are
    // reference types in JS, we do not want to modify that array in the parent when stocks are temporarily added removed in the dialog.
    this.portfolioStocks = _.cloneDeep(this.data.portfolioStocks);

    this.portfolioForm = this.fb.group({
      holdings: new FormArray([]),
    });
  }

  /** Validates the form, ensuring the fields have valid inputs and the total weighting equals 100%. */
  portfolioFormIsValid(): boolean {
    const portfolioTableValid =
      this.portfolioTable.getHoldings().length === 0 ||
      (this.portfolioTable.getHoldings().length > 0 && this.portfolioTable.getTotalWeighting() === 100);

    return !this.portfolioForm.invalid && portfolioTableValid;
  }

  /** Submits the form to create a new portfolio in the database. */
  onSubmit(): void {
    this.portfolioForm.setControl('holdings', this.fb.array(this.portfolioTable.getHoldings() || []));

    if (this.portfolioFormIsValid()) {
      this.portfolioService.updatePortfolioHoldings(this.data.portfolio.id, this.portfolioForm.value).subscribe(
        (portfolio: PortfolioDto) => {
          this.dialogRef.close(portfolio);
          this.snackBar.open(`Portfolio successfully updated!`, 'OK', {
            duration: 2000,
            panelClass: 'success-snackbar',
          });
        },
        (error: any) => {
          if (error.status === 401) {
            this.snackBar.open('You must login to create a portfolio.', 'OK', {
              duration: 3000,
              panelClass: 'warn-snackbar',
            });
          } else if (error.status === 409) {
            this.snackBar.open(error.error.message, '', {
              duration: 3000,
              panelClass: 'error-snackbar',
            });
          } else {
            this.snackBar.open('An error has occurred saving your portfolio.', 'OK', {
              duration: 3000,
              panelClass: 'error-snackbar',
            });
          }
        }
      );
    } else {
      this.snackBar.open('Please ensure your total weighting equals 100%.', 'OK', {
        duration: 3000,
        panelClass: 'warn-snackbar',
      });
    }
  }
}

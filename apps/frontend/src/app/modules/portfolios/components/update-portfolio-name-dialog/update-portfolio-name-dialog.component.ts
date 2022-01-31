import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { PortfolioDto } from '@ratemystocks/api-interface';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-update-portfolio-name-dialog',
  templateUrl: './update-portfolio-name-dialog.component.html',
  styleUrls: ['./update-portfolio-name-dialog.component.scss'],
})
export class UpdatePortfolioNameDialogComponent implements OnInit {
  portfolioNameForm: FormGroup;

  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(
    // public dialogRef: MatDialogRef<UpdatePortfolioNameDialogComponent>,
    private fb: FormBuilder,
    private portfolioService: PortfolioService // private snackBar: MatSnackBar,
  ) // @Inject(MAT_DIALOG_DATA) public data: any,
  {}

  ngOnInit(): void {
    // this.portfolioNameForm = this.fb.group({
    //   name: new FormControl(this.data.portfolio.name, { validators: [Validators.required, Validators.maxLength(40)] }),
    // });
    console.log('TEST');
  }

  /** Submits the form to update a portfolio in the database. */
  onSubmit() {
    // this.portfolioService
    //   .updatePortfolioName(this.data.portfolio.id, this.portfolioNameForm.value)
    //   .pipe(takeUntil(this.ngUnsubscribe.asObservable()))
    //   .subscribe(
    //     (portfolio: PortfolioDto) => {
    //       // This will return the updated portfolio to the parent of this dialog when the dialog is closed
    //       this.dialogRef.close(portfolio);
    //       this.snackBar.open(`Portfolio successfully updated!`, 'OK', {
    //         duration: 2000,
    //         panelClass: 'success-snackbar',
    //       });
    //     },
    //     (error: any) => {
    //       if (error.status === 401) {
    //         this.snackBar.open('You must login to update your portfolio.', 'OK', {
    //           duration: 3000,
    //           panelClass: 'warn-snackbar',
    //         });
    //       } else if (error.status === 409) {
    //         this.snackBar.open(error.error.message, '', {
    //           duration: 3000,
    //           panelClass: 'error-snackbar',
    //         });
    //       } else {
    //         this.snackBar.open('An error has occurred saving your portfolio.', 'OK', {
    //           duration: 3000,
    //           panelClass: 'error-snackbar',
    //         });
    //       }
    //     }
    //   );
  }
}

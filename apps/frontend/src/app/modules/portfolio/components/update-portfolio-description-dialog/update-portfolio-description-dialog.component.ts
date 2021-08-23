import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PortfolioDto } from '@ratemystocks/api-interface';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-update-portfolio-description-dialog',
  templateUrl: './update-portfolio-description-dialog.component.html',
  styleUrls: ['./update-portfolio-description-dialog.component.scss'],
})
export class UpdatePortfolioDescriptionDialogComponent implements OnInit {
  portfolioDescriptionForm: FormGroup;

  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(
    public dialogRef: MatDialogRef<UpdatePortfolioDescriptionDialogComponent>,
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.portfolioDescriptionForm = this.fb.group({
      description: new FormControl(this.data.portfolio.description, {
        validators: [Validators.required, Validators.maxLength(500)],
      }),
    });
  }

  /** Submits the form to update a portfolio in the database. */
  onSubmit() {
    const mutation = gql`
      mutation UpdatePortfolioDescription($id: String!, $description: String!) {
        updatePortfolio(id: $id, portfolio: { description: $description }) {
          id
          description
        }
      }
    `;

    this.apollo
      .mutate({
        mutation: mutation,
        variables: {
          id: this.data.portfolio.id,
          description: this.portfolioDescriptionForm.value.description,
        },
      })
      .subscribe(
        (result: any) => {
          // This will return the updated portfolio description to the parent of this dialog when the dialog is closed
          this.dialogRef.close(result.data.updatePortfolio.description);

          this.snackBar.open(`Portfolio successfully updated!`, 'OK', {
            duration: 2000,
            panelClass: 'success-snackbar',
          });
        },
        (error: any) => {
          if (error.status === 401) {
            this.snackBar.open('You must login to update your portfolio.', 'OK', {
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
  }
}

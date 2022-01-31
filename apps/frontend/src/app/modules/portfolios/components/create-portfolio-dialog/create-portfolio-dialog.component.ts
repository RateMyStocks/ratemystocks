import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IexCloudSearchDto, PortfolioDto } from '@ratemystocks/api-interface';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StockSearchService } from '../../../../core/services/stock-search.service';
// import { PortfolioHoldingsTableComponent } from '../portfolio-holdings-table/portfolio-holdings-table.component';

@Component({
  selector: 'app-create-portfolio-dialog',
  templateUrl: './create-portfolio-dialog.component.html',
  styleUrls: ['./create-portfolio-dialog.component.scss'],
})
export class CreatePortfolioDialogComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject();

  filteredStocks: IexCloudSearchDto[];
  selectedStock: IexCloudSearchDto;

  portfolioForm: FormGroup = new FormGroup({
    name: new FormControl('', { validators: [Validators.required, Validators.maxLength(40)] }),
    description: new FormControl('', { validators: [Validators.maxLength(500)] }),
    holdings: new FormArray([]),
  });

  // @ViewChild('portfolioTable') portfolioTable: PortfolioHoldingsTableComponent;

  // @Input()
  // display = false;

  constructor(
    private portfolioService: PortfolioService,
    private stockSearchService: StockSearchService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.portfolioForm = this.fb.group({
    //   name: new FormControl('', { validators: [Validators.required, Validators.maxLength(40)] }),
    //   description: new FormControl('', { validators: [Validators.maxLength(500)] }),
    //   holdings: new FormArray([]),
    // });
    console.log('TEST');
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  get name(): any {
    return this.portfolioForm.get('name');
  }

  get description(): any {
    return this.portfolioForm.get('description');
  }

  /** Validates the form, ensuring the fields have valid inputs and the total weighting equals 100%. */
  portfolioFormIsValid(): boolean {
    // const portfolioTableValid =
    //   this.portfolioTable.getHoldings().length === 0 ||
    //   (this.portfolioTable.getHoldings().length > 0 && this.portfolioTable.getTotalWeighting() === 100);
    // return !this.portfolioForm.invalid && portfolioTableValid;

    return false;
  }

  /** Submits the form to create a new portfolio in the database. */
  onSubmit(): void {
    // this.portfolioForm.setControl('holdings', this.fb.array(this.portfolioTable.getHoldings() || []));

    if (this.portfolioFormIsValid()) {
      this.portfolioService
        .createPortfolio(this.portfolioForm.value)
        .pipe(takeUntil(this.ngUnsubscribe.asObservable()))
        .subscribe(
          (portfolio: PortfolioDto) => {
            // this.dialogRef.close();
            // this.snackBar.open(`Portfolio successfully created!`, 'OK', {
            //   duration: 2000,
            //   panelClass: 'success-snackbar',
            // });
            this.router.navigate(['/portfolios', portfolio.id]);
          },
          (error: any) => {
            // if (error.status === 401) {
            //   this.snackBar.open('You must login to create a portfolio.', 'OK', {
            //     duration: 3000,
            //     panelClass: 'warn-snackbar',
            //   });
            // } else if (error.status === 409) {
            //   this.snackBar.open(error.error.message, '', {
            //     duration: 3000,
            //     panelClass: 'error-snackbar',
            //   });
            // } else {
            //   this.snackBar.open('An error has occurred saving your portfolio.', 'OK', {
            //     duration: 3000,
            //     panelClass: 'error-snackbar',
            //   });
            // }
          }
        );
    } else {
      // this.snackBar.open('Please ensure your total weighting equals 100%.', 'OK', {
      //   duration: 3000,
      //   panelClass: 'warn-snackbar',
      // });
    }
  }

  /**
   *
   * @param event
   */
  searchStocks(event: { originalEvent: InputEvent; query: string }): void {
    this.stockSearchService.searchStocks(event.query).subscribe((result: IexCloudSearchDto[]) => {
      this.filteredStocks = result;
    });
  }

  /**
   *
   * @param selectStock
   */
  onSelectStock(selectStock: IexCloudSearchDto): void {
    const tickerSymbol: string = selectStock.symbol;

    // this.router.navigate(['/stocks', tickerSymbol]);
  }
}

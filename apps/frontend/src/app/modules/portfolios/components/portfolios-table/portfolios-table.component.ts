import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IexCloudCompanyDto,
  IexCloudSearchDto,
  ListPortfoliosDto,
  PortfolioDto,
  PortfolioStockDto,
} from '@ratemystocks/api-interface';
import * as moment from 'moment';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { StockSearchService } from '../../../../core/services/stock-search.service';
import { SortDirection } from '../../../../shared/models/enums/sort-direction';

@Component({
  selector: 'app-portfolios-table',
  templateUrl: './portfolios-table.component.html',
  styleUrls: ['./portfolios-table.component.scss'],
})
export class PortfoliosTableComponent {
  // TODO: Add type for this
  private ngUnsubscribe: Subject<void> = new Subject();

  portfolios = [];
  totalRecords: number;

  moment = moment;

  loading = true;

  displayCreatePortfolioDialog = false;

  filteredStocks: IexCloudSearchDto[];
  selectedStock: IexCloudSearchDto;
  selectedStocks: IexCloudSearchDto[];

  portfolioStocks: PortfolioStockDto[] = [];

  portfolioForm: FormGroup = new FormGroup({
    name: new FormControl('', { validators: [Validators.required, Validators.maxLength(40)] }),
    description: new FormControl('', { validators: [Validators.maxLength(500)] }),
    holdings: new FormArray([]),
  });

  constructor(
    private portfolioService: PortfolioService,
    private stockSearchService: StockSearchService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  loadPortfolios(event: LazyLoadEvent) {
    this.loading = true;

    this.portfolioService.getPortfolios(50, event.first, 'num_likes', SortDirection.DESC, '').subscribe(
      (listPortfolioDto: ListPortfoliosDto) => {
        this.portfolios = listPortfolioDto.items;
        this.totalRecords = listPortfolioDto.totalCount;

        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  confirmLogin(event: Event) {
    if (this.authService.isAuthorized()) {
      this.showDialog();
    } else {
      this.confirmationService.confirm({
        target: event.target,
        message: 'You must have an account. Would you like to login?',
        accept: () => {
          this.router.navigate(['/login']);
        },
        reject: () => {
          // this.displayCreatePortfolioDialog = false;
        },
      });
    }
  }

  showDialog() {
    this.displayCreatePortfolioDialog = true;
  }

  // TODO: Rename these
  get name(): FormControl {
    return this.portfolioForm.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.portfolioForm.get('description') as FormControl;
  }

  get holdings(): FormArray {
    return this.portfolioForm.get('holdings') as FormArray;
  }

  /** Validates the form, ensuring the fields have valid inputs and the total weighting equals 100%. */
  portfolioFormIsValid(): boolean {
    const holdings = this.portfolioForm.get('holdings') as FormArray;

    const portfolioTableValid =
      this.portfolioStocks.length === 0 || (this.portfolioStocks.length > 0 && this.getTotalWeighting() === 100);

    return this.portfolioForm.valid && portfolioTableValid;

    return false;
  }

  /** Submits the form to create a new portfolio in the database. */
  onSubmit(): void {
    this.portfolioForm.setControl('holdings', this.fb.array(this.portfolioStocks || []));

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
   * Event handler for when a stock is selected from the autocomplete that will add a stock to the portfolio to-be-created.
   * @param selectStock The IexCloudSearchDto object representing the stock that was searched and selected.
   */
  onSelectStock(selectStock: IexCloudSearchDto): void {
    const portfolioStock: PortfolioStockDto = {
      ticker: selectStock.symbol,
      weighting: 0,
      id: null,
      portfolioId: null,
    };

    this.portfolioStocks.push(portfolioStock);

    // this.selectedStocks.push(selectStock);

    // const portfolioHoldingFormGroup = new FormGroup({
    //   ticker: new FormControl(portfolioStock.ticker),
    //   weighting: new FormControl(0),
    // });
    // this.holdings.push(portfolioHoldingFormGroup);

    // console.log(this.holdings);
  }

  onRemoveStock(selectStock: IexCloudCompanyDto): void {
    this.portfolioStocks.splice(
      this.portfolioStocks.findIndex((item) => item.ticker === selectStock.symbol),
      1
    );

    // console.log(this.selectedStocks);

    // this.selectedStocks.splice(
    //   this.portfolioStocks.findIndex((item) => item.ticker === selectStock.symbol),
    //   1
    // );
  }

  /** Gets the total cost of all transactions. */
  getTotalWeighting(): number {
    const total = this.portfolioStocks.reduce((sum: number, v: PortfolioStockDto) => (sum += Number(v.weighting)), 0);
    return total;
  }
}

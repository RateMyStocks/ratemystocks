import { Component, OnInit, OnChanges, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { StockService } from '../../../../core/services/stock.service';
import { StockRatingCountDto, IexCloudStockDataDto } from '@ratemystocks/api-interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-stock-page-header',
  templateUrl: './stock-page-header.component.html',
  styleUrls: ['./stock-page-header.component.scss'],
})
export class StockPageHeaderComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  stock: { rating: StockRatingCountDto; data: IexCloudStockDataDto } = null;

  @Output()
  ratingUpdated: EventEmitter<any> = new EventEmitter();

  @Input()
  ticker: string;

  isAuth: boolean;
  userRating: string;
  auth$: Subscription;
  private ngUnsubscribe = new Subject();

  constructor(private authService: AuthService, private stockService: StockService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.isAuth = this.authService.isAuthorized();
    if (this.isAuth) {
      this.fetchUserRating();
    } else {
      this.userRating = null;
    }

    this.auth$ = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuth = authStatus;
      if (this.isAuth) {
        this.fetchUserRating();
      }
    });
  }

  ngOnChanges(): void {
    this.isAuth = this.authService.isAuthorized();
    if (this.isAuth) {
      this.fetchUserRating();
    } else {
      this.userRating = null;
    }
  }

  ngOnDestroy(): void {
    this.auth$.unsubscribe();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Calls the backend to create a new user active stock rating and deactives the user's previous rating.
   * @param value The rating type e.g. "Buy", "Hold", or "Sell"
   */
  toggleRating(value: string): void {
    if (this.isAuth) {
      if (this.userRating !== value) {
        this.stock.rating[this.userRating] = this.stock.rating[this.userRating] - 1;
        this.userRating = value;
        this.stock.rating[this.userRating] = this.stock.rating[this.userRating] + 1;
        this.stockService
          .updateUserRating(this.ticker, this.userRating)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe();

        this.ratingUpdated.emit();
      }
    } else {
      this.snackBar.open('You must login to rate this stock.', 'OK', {
        duration: 3000,
        panelClass: 'warn-snackbar',
      });
    }
  }

  /** Calls the backend to get the user's active rating for a given stock, if it exists. */
  fetchUserRating(): void {
    this.stockService
      .getUserRating(this.ticker)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: { stockRating: string }) => {
        this.userRating = res.stockRating;
      });
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { StockSearchService } from '../../../core/services/stock-search.service';
import type { IexCloudSearchDto } from '@ratemystocks/api-interface';

@Component({
  selector: 'ratemystocks-stock-search',
  templateUrl: './stock-search.component.html',
  styleUrls: ['./stock-search.component.scss'],
})
export class StockSearchComponent implements OnInit {
  // The placeholder text for the input field
  @Input() placeholder: string;

  // Redirect indicates that upon selecting a search result, the user will be redirected that Stock page.
  @Input() redirect: boolean;

  stockCtrl = new FormControl();

  filteredStocks$: Observable<IexCloudSearchDto[]>;
  filteredStocks: IexCloudSearchDto[];

  isLoading = false;

  constructor(private stockSearchService: StockSearchService, private router: Router) {}

  ngOnInit() {
    this.stockCtrl.valueChanges
      .pipe(
        tap(() => (this.isLoading = true)),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchInput: string) => this.filterStocks(searchInput))
      )
      .subscribe((res: IexCloudSearchDto[]) => (this.filteredStocks = res));
  }

  /**
   * Filters the stocks based on either company name or ticker symbol.
   * @param value The text entered into the search field
   * @return An array of StockSearchResult objects from as an Observable
   */
  private filterStocks(value: string): Observable<IexCloudSearchDto[]> {
    const filterValue = value.toLowerCase();

    return value
      ? this.stockSearchService.searchStocks(value).pipe(finalize(() => (this.isLoading = false)))
      : of<IexCloudSearchDto[]>([]).pipe(finalize(() => (this.isLoading = false)));
  }

  /**
   * Redirects to a /stocks/:ticker when a stock is clicked from the autocomplete dropdown
   * @param event The MatAutocompleteSelectedEvent that is emitted whenever an option from the list is selected.
   * @return The selected IEXStockSearchResult object.
   */
  public onSelectStock(event: MatAutocompleteSelectedEvent): IexCloudSearchDto {
    const stock: IexCloudSearchDto = event.option.value;

    const tickerSymbol: string = stock.symbol;

    if (this.redirect) {
      this.router.navigate(['/stocks', tickerSymbol]);
    } else {
      // If we are not redirecting to the Stock page, set the selected stock so it can be used for other purposes
      this.stockSearchService.setSelectedStock(stock);
    }

    this.stockCtrl.setValue('');

    return stock;
  }

  /**
   * Wraps the matching search text with a <mark> element to highlight it.
   * @param term The entered search term.
   * @param result The result from the stock search.
   * @return The updated string with the matched text highlighted.
   */
  highlightMatchingSearchText(term: string, result: string): string {
    return result.replace(new RegExp(term, 'gi'), (match: string) => `<mark>${match}</mark>`);
  }
}

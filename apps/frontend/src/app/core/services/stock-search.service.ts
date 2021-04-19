import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IexCloudSearchDto } from '@ratemystocks/api-interface';

@Injectable({
  providedIn: 'root',
})
export class StockSearchService {
  private stockSelected: Subject<IexCloudSearchDto> = new Subject();

  constructor(private http: HttpClient) {}

  /**
   * When the one of the autocomplete stock search results is clicked on, set that result the selected stock.
   * @param selectedStock The selected search result as an IEXStockSearchResult.
   */
  setSelectedStock(selectedStock: IexCloudSearchDto): void {
    this.stockSelected.next(selectedStock);
  }

  /**
   * Gets the stock the user selected from the stock search results.
   * @returns The stock selected from the autocompleted search results.
   */
  getSelectedStock(): Subject<IexCloudSearchDto> {
    return this.stockSelected;
  }

  /**
   * Calls our REST API which will forward the request to IEX Cloud to retrieve stocks matching a search query.
   * {@link https://iexcloud.io/docs/api/#search}
   * @param searchText The search input (should be stock ticker symbol or security name) to filter stocks by
   * @return An array of stock search results from IEX Cloud API
   */
  searchStocks(searchText: string): Observable<IexCloudSearchDto[]> {
    const searchEndpoint = `${environment.apiUrl}/iex/search/${searchText}`;

    return this.http.get<IexCloudSearchDto[]>(searchEndpoint).pipe(
      timeout(5000),
      catchError((e: any) => {
        return of(null);
      })
    );
  }
}

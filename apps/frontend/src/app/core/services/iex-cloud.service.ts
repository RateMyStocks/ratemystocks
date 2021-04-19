import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IexCloudService {
  constructor(private http: HttpClient) {}

  /**
   * Queries IEX Cloud API for stock data in a batch request for multiple stocks and multiple data points.
   * @param symbols The stock ticker symbols to be used as query params in the URL.
   * @param endpoints The names of data endpoints in IEX cloud i.e. "company", "news", "stats", etc.
   * @return The JSON response  from IEX Cloud i.e. { "AAPL": { company: { companyName: "Apple" ... } } }
   */
  batchGetStocks(symbols: string[], endpoints: string[]): Observable<any> {
    const endpoint = `${environment.apiUrl}/iex/stocks/batch?symbols=${symbols.join(',')}&endpoints=${endpoints.join(
      ','
    )}`;
    return this.http.get<any>(endpoint);
  }

  /**
   * Gets chart data for the ticker depending on the range. Date is currently not used but might be useful later on.
   */
  getStockCharts(ticker: string, range: string, date?: string) {
    let endpoint = `${environment.apiUrl}/iex/stocks/${ticker}/chart/${range}`;
    if (date) {
      endpoint += `?${date}`;
    }
    return this.http.get<any[]>(endpoint);
  }
}

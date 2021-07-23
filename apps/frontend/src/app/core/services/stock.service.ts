import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StockRatingCountDto, IexCloudStockDataDto } from '@ratemystocks/api-interface';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private baseApiUrl = `${environment.apiUrl}/stock`;

  constructor(private httpClient: HttpClient) {}

  /**
   * Calls the backend to get data for a given Stock page based on the ticker symbol
   * @param ticker The stock ticker symbol
   * @return A DTO containig the stock rating data and IEX Cloud API data for that stock.
   */
  getStock(ticker: string): Observable<{ rating: StockRatingCountDto; data: IexCloudStockDataDto }> {
    return this.httpClient.get<{ rating: StockRatingCountDto; data: IexCloudStockDataDto }>(
      `${this.baseApiUrl}/${ticker}`,
      {}
    );
  }

  /**
   * Calls the backend to get a user's rating (e.g. Buy, Hold, or Sell) for a given stock.
   * @param ticker The ticker symbol of the stock to get the user rating for.
   * @return The user's stock rating.
   */
  getUserRating(ticker: string): Observable<{ stockRating: string }> {
    return this.httpClient.get<{ stockRating: string }>(`${this.baseApiUrl}/rating/user/${ticker}`, {
      withCredentials: true,
    });
  }

  /**
   * Calls the backend to create a new active user rating for a given stock, and
   * marks the existing rating for that stock as inactive.
   * @param ticker The ticker symbol of the stock to add a rating for.
   * @param stockRating The rating for the stock e.g. "Buy", "Hold", or "Sell"
   */
  updateUserRating(ticker: string, stockRating: string): Observable<any> {
    return this.httpClient.post<any>(
      `${this.baseApiUrl}/rating/user/${ticker}`,
      { stockRating },
      { withCredentials: true }
    );
  }
}

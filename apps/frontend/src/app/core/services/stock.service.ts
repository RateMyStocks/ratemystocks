import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StockRatingCountDto, IexCloudStockDataDto, StockRatingListItem } from '@ratemystocks/api-interface';

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
   * Gets a "Top 100" list of stocks that have been rated by users of a certain ategory
   * @param listType The stock list type e.g. Most Popular, Most Liked, or Most Disliked stocks
   * @param lastNDays The number of days from the current date to retrieve stock ratings for.
   * @return The list of stocks with their rating counts.
   */
  getStocks(
    listType: 'most-popular' | 'most-liked' | 'most-disliked',
    lastNDays?: number
  ): Observable<StockRatingListItem[]> {
    let endpoint = `${this.baseApiUrl}/ratings/${listType}`;
    if (lastNDays) {
      endpoint += `?lastNDays=${lastNDays}`;
    }
    return this.httpClient.get<StockRatingListItem[]>(endpoint);
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
   * Gets a list of stock ratings for a given user.
   * @param userId The UUID of the user to fetch stock ratings for.
   * @param showInactive True to return a full history of stock ratings, false to only show active ratings.
   * @return The list of stocks and their ratings from a given user.
   */
  getStockRatingsForUser(userId: string, showInactive: boolean): Observable<any> {
    const endpoint = `${this.baseApiUrl}/ratings/user/${userId}?showInactive=` + showInactive;
    return this.httpClient.get<any[]>(endpoint);
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

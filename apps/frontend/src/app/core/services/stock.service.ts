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

  /**
   * Adds a visit to the stock_visit table indicating a page visit on a given stock page.
   * @param ticker The ticker symbol of the stock page being visited.
   * @param userId (Optional) If a logged-in user visits the stock page, this query parameter will be supplied.
   * @returns The number of page visits for a given stock ticker symbol.
   */
  addStockPageVisit(ticker: string, userId?: string): Observable<number> {
    // return this.httpClient.post<any>(`${this.baseApiUrl}/visit-count/${ticker}?userId=${userId}`, null);
    const url = userId
      ? `${this.baseApiUrl}/visit-count/${ticker}?userId=${userId}`
      : `${this.baseApiUrl}/visit-count/${ticker}`;
    return this.httpClient.post<any>(url, null);
  }

  /**
   * Returns a list of the stock page visit counts for the last N days (defaults to 6).
   * @param ticker The ticker symbol of the stock to get the visit count sfor.
   * @param lastNDays Query param indicating the number of days from the current day to get visit counts for.
   * @returns A list of the stock page visit counts for the last N days.
   */
  getStockVisitCounts(ticker: string, lastNDays?: number): Observable<any> {
    const url = `${this.baseApiUrl}/visit-counts/${ticker}?lastNDays=lastNDays`;
    return this.httpClient.get<any>(url);
  }

  /**
   * Creating an entry in the stock_follower table, thus tying a logged-in user to a given ticker symbol so they
   * can be notified of updates and news events later on.
   * @param userAccount The logged-in user following the stock.
   * @param ticker The ticker symbol of the stock page being followed.
   * @returns The number of page visits for a given stock ticker symbol.
   */
  followStock(ticker: string): Observable<void> {
    return this.httpClient.post<void>(`${this.baseApiUrl}/follow/${ticker}`, null, { withCredentials: true });
  }

  /**
   * Deletes the entry in the stock_follower table, so the specified user
   * will unfollow a stock if it is already following it.
   * @param userAccount The account object of the logged-in user.
   * @param ticker The ticker symbol of the stock the user is following.
   * @throws 404 If the user specified isn't actually following the stock.
   */
  unfollowStock(ticker: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseApiUrl}/unfollow/${ticker}`, { withCredentials: true });
  }

  /**
   * Returns true if the logged-in user is following a given stock, false otherwise.
   * @param userAccount The UserAccount object of the logged-in user.
   * @param ticker The ticker symbol of the stock to check against.
   * @returns true if the logged-in user is following a given stock, false otherwise.
   */
  isFollowingStock(ticker: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseApiUrl}/isfollowing/${ticker}`, { withCredentials: true });
  }

  /**
   * Gets the number of followers for a given stock.
   * @param ticker The ticker symbol of the stock to get the number of followers for.
   * @return The number of followers for a given stock ticker symbol.
   */
  getTotalFollowerCounts(ticker: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseApiUrl}/follower-count/${ticker}`);
  }

  /**
   * Gets the number of followers by day for a given stock over a given time period.
   * @param ticker The ticker symbol of the stock to get the number of followers for.
   * @param lastNDays Optional query parameter indicating the past number of days to get counts for.
   * @return The number of followers by day for a given stock over a given time period.
   */
  getFollowerCountsLastNDays(ticker: string, lastNDays?: number): Observable<any> {
    const url = `${this.baseApiUrl}/follower-counts/${ticker}?lastNDays=lastNDays`;
    return this.httpClient.get<any>(url);
  }

  /**
   * Gets the most viewed stock tickers today.
   * @param limit The limit of stocks to get e.g. top 20 most viewed, top 10, etc.
   * @returns The most viewed stocks in the system in descending order.
   */
  getMostViewedStocksToday(limit?: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseApiUrl}/trending/today`);
  }
}

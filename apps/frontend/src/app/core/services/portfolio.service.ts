import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreatePortfolioDto,
  CreatePortfolioRatingDto,
  CreatePortfolioStockDto,
  ListPortfoliosDto,
  PortfolioDto,
  PortfolioRatingDto,
  PortfolioStockDto,
  UserPortfolioDto,
} from '@ratemystocks/api-interface';
import { SortDirection } from '../../shared/models/enums/sort-direction';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  constructor(private http: HttpClient) {}

  /**
   * Gets a list of portfolios, optionally filtering down the results by portfolio name, sorting by portfolio field,
   * and paginating the results. Should return all portfolios in the system if no filters provided.
   * @param pageSize The number of portfolios to return.
   * @param skip The number of entries to skip at the beginning of the returned list
   * @param orderBy The column/field of the Portfolio to sort by.
   * @param sortDirection Either 'ASC' or 'DESC' to indicate whether to sort 'orderBy' in ascending or descending order.
   * @param filter The search text to filter portfolios by (currently only filtered by portfolio name).
   * @return An object including a filtered list of portfolios and also a total count of all portfolios in the database.
   */
  getPortfolios(
    pageSize?: number,
    skip?: number,
    orderBy?: string,
    sortDirection?: SortDirection,
    filter?: string
  ): Observable<ListPortfoliosDto> {
    const endpoint = `${environment.apiUrl}/portfolio/list?pageSize=${pageSize}&skip=${skip}&orderBy=${orderBy}&sortDirection=${sortDirection}&filter=${filter}`;
    return this.http.get<ListPortfoliosDto>(endpoint);
  }

  /**
   * Gets a list of portfolios by user ID.
   * @param userId The UUID of the user whose portfolios will be fetched.
   * @return A list of DTOs representing the portfolios a user has created.
   */
  getPortfoliosByUserId(userId: string): Observable<UserPortfolioDto[]> {
    const endpoint = `${environment.apiUrl}/portfolio/list/${userId}`;
    return this.http.get<any>(endpoint);
  }

  /**
   * Fetches a portfolio from the database by UUID.
   * @param id The UUID of the portfolio to fetch.
   * @return An object representing the PortfolioEntity from the database.
   */
  getPortfolio(id: string): Observable<PortfolioDto> {
    const endpoint = `${environment.apiUrl}/portfolio/${id}`;
    return this.http.get<PortfolioDto>(endpoint);
  }

  /**
   * Fetches an array of stocks/holdings for a given Portfolio.
   * @param id The UUID of the portfolio to retrieve stocks/holdings for.
   * @return An array representing the list of stocks/holdings for a given portfolio.
   */
  getPortfolioStocks(id: string): Observable<PortfolioStockDto[]> {
    const endpoint = `${environment.apiUrl}/portfolio/${id}/stocks`;
    return this.http.get<PortfolioStockDto[]>(endpoint);
  }

  /**
   * Calls the API to create a Portfolio in the database.
   * @param portfolio The DTO containing minimal data to create a Portfolio in the database.
   * @return The PortfolioEntity that was created in the database.
   */
  createPortfolio(portfolio: CreatePortfolioDto): Observable<PortfolioDto> {
    const endpoint = `${environment.apiUrl}/portfolio`;

    return this.http.post<PortfolioDto>(endpoint, portfolio, { withCredentials: true });
  }

  /**
   * Updates the name of an existing portfolio
   * @param portfolioId The UUID that uniquely identifies the portfolio in the database that will be updated.
   * @param portfolioName An object containing the name to set on the portfolio.
   * @return The updated portfolio object with the new name.
   */
  updatePortfolioName(portfolioId: string, portfolioName: { name: string }): Observable<PortfolioDto> {
    const endpoint = `${environment.apiUrl}/portfolio/name/${portfolioId}`;

    return this.http.patch<PortfolioDto>(endpoint, portfolioName, { withCredentials: true });
  }

  /**
   * Updates the description of an existing portfolio
   * @param portfolioId The UUID that uniquely identifies the portfolio in the database that will be updated.
   * @param portfolioName An object containing the description to set on the portfolio.
   * @return The updated portfolio object with the new description.
   */
  updatePortfolioDescription(
    portfolioId: string,
    portfolioDescription: { description: string }
  ): Observable<PortfolioDto> {
    const endpoint = `${environment.apiUrl}/portfolio/description/${portfolioId}`;

    return this.http.patch<PortfolioDto>(endpoint, portfolioDescription, { withCredentials: true });
  }

  /**
   * Updates the holdings of an existing portfolio
   * @param portfolioId The UUID that uniquely identifies the portfolio in the database that will be updated.
   * @param portfolioHoldings An object containing the holdings to set on the portfolio.
   * @return The updated portfolio object with the updated holdings.
   */
  updatePortfolioHoldings(
    portfolioId: string,
    portfolioHoldings: { holdings: CreatePortfolioStockDto[] }
  ): Observable<PortfolioDto> {
    const endpoint = `${environment.apiUrl}/portfolio/holdings/${portfolioId}`;

    return this.http.patch<PortfolioDto>(endpoint, portfolioHoldings, { withCredentials: true });
  }

  /**
   * Performs a GET request to retrieve the portfolio rating counts (number of likes & dislikes) for a given portfolio.
   * @param portfolioId The UUID string of the portfolio to retrieve rating counts fors.
   * @return An object containing the likes & dislikes counts as integer values.
   */
  getPortfolioRatingCounts(portfolioId: string): Observable<{ likes: number; dislikes: number }> {
    const endpoint = `${environment.apiUrl}/portfolio/${portfolioId}/ratings`;
    return this.http.get<{ likes: number; dislikes: number }>(endpoint);
  }

  /**
   * Performs a GET request to get the logged-in user's portfolio rating if it exists.
   * @param portfolioId The UUID of the portfolio to get a user rating.
   * @return The PortfolioRating object for that portfolio & logged-in user, if it exists.
   */
  getPortfolioUserRating(portfolioId: string): Observable<PortfolioRatingDto> {
    const endpoint = `${environment.apiUrl}/portfolio/${portfolioId}/ratings/user`;
    return this.http.get<PortfolioRatingDto>(endpoint, { withCredentials: true });
  }

  /**
   * Performs a PUT request to perform an upsert on a user's portfolio rating.
   * @param portfolioId The UUID string of the portfolio to be updated.
   * @param portfolioRatingsDto A DTO containing the necessary data to create/update a portfolio.
   * @return Either the newly created PortfolioRating object or the updated one if it already existed.
   */
  createOrUpdatePortfolioRating(
    portfolioId: string,
    portfolioRatingsDto: CreatePortfolioRatingDto
  ): Observable<PortfolioRatingDto> {
    const endpoint = `${environment.apiUrl}/portfolio/${portfolioId}/ratings/user`;
    return this.http.put<PortfolioRatingDto>(endpoint, portfolioRatingsDto, { withCredentials: true });
  }

  /**
   * Makes a DELETE request to delete a user's portfolio by ID.
   * @param portfolioId The portfolio's UUID as a string.
   */
  deletePortfolioById(portfolioId: string): Observable<void> {
    const endpoint = `${environment.apiUrl}/portfolio/${portfolioId}`;
    return this.http.delete<void>(endpoint, { withCredentials: true });
  }

  /**
   * Makes a DELETE request to delete a user's portfolio rating by ID.
   * @param portfolioRatingId The portfolio rating UUID as a string.
   */
  deletePortfolioRating(portfolioRatingId: string): Observable<void> {
    const endpoint = `${environment.apiUrl}/portfolio/${portfolioRatingId}/ratings/user`;
    return this.http.delete<void>(endpoint, { withCredentials: true });
  }

  /**
   * Adds a visit to the portfolio_visit table indicating a page visit for some portfolio.
   * @param portfolioId The portfolioId of the portfolio being visited.
   * @param userId (Optional) If a logged-in user visits the portfolio page, this query parameter will be supplied.
   * @returns The number of page visits for a given portfolio
   */
  addPortfolioPageVisit(portfolioId: string, userId?: string): Observable<number> {
    // return this.httpClient.post<any>(`${this.baseApiUrl}/visit-count/${ticker}?userId=${userId}`, null);
    const url = userId
      ? `${environment.apiUrl}/portfolio/visit-count/${portfolioId}?userId=${userId}`
      : `${environment.apiUrl}/portfolio/visit-count/${portfolioId}`;
    return this.http.post<any>(url, null);
  }

  /**
   * Returns a list of the portfolio page visit counts for the last N days (defaults to 6).
   * @param portfolioId The id of the portfolio to get the visit count sfor.
   * @param lastNDays Query param indicating the number of days from the current day to get visit counts for.
   * @returns A list of the portfolio page visit counts for the last N days.
   */
  getPortfolioVisitCounts(portfolioId: string, lastNDays = 6): Observable<any> {
    const url = `${environment.apiUrl}/portfolio/visit-counts/${portfolioId}?lastNDays=${lastNDays}`;
    return this.http.get<any>(url);
  }

  /**
   * Creating an entry in the portfolio_follower table allowing a user to follow a portfolio.
   * @param userAccount The logged-in user following the portfolio.
   * @param portfolioId The id of the portfolio being followed.
   * @returns The number of page visits for a given portfolio.
   */
  followPortfolio(portfolioId: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/portfolio/follow/${portfolioId}`, null, {
      withCredentials: true,
    });
  }

  /**
   * Deletes the entry in the portfolio_follower table, so the specified user
   * will unfollow a portfolio if it is already following it.
   * @param userAccount The account object of the logged-in user.
   * @param portfolioId The id of the portfolio the user is following.
   * @throws 404 If the user specified isn't actually following the portfolio.
   */
  unfollowPortfolio(portfolioId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/portfolio/unfollow/${portfolioId}`, { withCredentials: true });
  }

  /**
   * Returns true if the logged-in user is following a given portfolio, false otherwise.
   * @param userAccount The UserAccount object of the logged-in user.
   * @param portfolioId The id of the portfolio to check against.
   * @returns true if the logged-in user is following a given portfolio, false otherwise.
   */
  isFollowingPortfolio(portfolioId: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/portfolio/isfollowing/${portfolioId}`, {
      withCredentials: true,
    });
  }

  /**
   * Gets the number of followers for a given portfolio.
   * @param portfolioId The id of the portfolio to get the number of followers for.
   * @return The number of followers for a given portfolio.
   */
  getTotalFollowerCounts(ticker: string): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/portfolio/follower-count/${ticker}`);
  }

  /**
   * Gets the number of followers by day for a given portfolio over a given time period.
   * @param portfolioId The id of the portfolio to get the number of followers for.
   * @param lastNDays Optional query parameter indicating the past number of days to get counts for.
   * @return The number of followers by day for a given portfolio over a given time period.
   */
  getFollowerCountsLastNDays(ticker: string, lastNDays = 6): Observable<any> {
    const url = `${environment.apiUrl}/portfolio/follower-counts/${ticker}?lastNDays=${lastNDays}`;
    return this.http.get<any>(url);
  }
}

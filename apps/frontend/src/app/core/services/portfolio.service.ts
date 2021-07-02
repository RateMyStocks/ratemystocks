import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreatePortfolioDto,
  CreatePortfolioRatingDto,
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
}

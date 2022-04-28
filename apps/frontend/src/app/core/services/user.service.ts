import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PortfolioDto, UserProfileDto, EditUserProfileDto } from '@ratemystocks/api-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  /**
   * Fetches a user from the database given a unique username.
   * @param username The username to query the database for.
   * @return An object representing the user account.
   */
  getUserByUsername(username: string): Observable<UserProfileDto> {
    const endpoint = `${environment.apiUrl}/users/${username}`;
    return this.http.get<UserProfileDto>(endpoint);
  }

  /**
   * Saves/bookmarks a portfolio to a user account.
   * @param portfolioId The id of the portfolio to save to the user account.
   */
  savePortfolioToUserAccount(portfolioId: string): Observable<unknown> {
    const endpoint = `${environment.apiUrl}/users/save-portfolio/${portfolioId}`;
    return this.http.patch(endpoint, { withCredentials: true });
  }

  /**
   * "Unsaves" portfolio from the logged-in user's account.
   * @param portfolioId The id of the portfolio to unsave from the user account.
   */
  unsavePortfolioFromUserAccount(portfolioId: string): Observable<unknown> {
    const endpoint = `${environment.apiUrl}/users/unsave-portfolio/${portfolioId}`;
    return this.http.patch(endpoint, { withCredentials: true });
  }

  /**
   * Gets an array of the portfolios saved to the logged-in user's account.
   * @return An array of the logged-in user's saved portfolios.
   */
  getSavedPortfoliosForUser(): Observable<PortfolioDto[]> {
    const endpoint = `${environment.apiUrl}/users/saved/portfolios`;
    return this.http.get<PortfolioDto[]>(endpoint, { withCredentials: true });
  }

  /**
   * Gets the stocks a user is following.
   * @param userAccount The userAccount object of the logged-in user.
   * @returns The list of stocks the logged-in user is following.
   */
  getSavedStocksForUser(): Observable<any[]> {
    const endpoint = `${environment.apiUrl}/users/saved/stocks`;
    return this.http.get<any[]>(endpoint, { withCredentials: true });
  }

  /**
   * Endpoint for updating the Profile information for the logged-in User.
   * @param profileDto The DTO containing the User Profile data to be updated.
   */
  updateUserProfileInfo(profileDto: EditUserProfileDto): Observable<void> {
    const endpoint = `${environment.apiUrl}/users/profile/info`;
    return this.http.patch<void>(endpoint, profileDto, { withCredentials: true });
  }
}

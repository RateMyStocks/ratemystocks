import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProfileDto } from '@ratemystocks/api-interface';
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
}

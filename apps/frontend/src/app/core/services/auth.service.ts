import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusCodes } from '../../shared/utilities/status-codes.enum';
import { AuthCredentialDto, SignUpDto, SignInResponseDto, SpiritAnimal } from '@ratemystocks/api-interface';
import { LocalStorageService } from './local-storage.service';

const BACKEND_URL: string = environment.apiUrl + '/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  // TODO: I think these should be behavior subjects, so that if a user logs out and switches to another account, the updates to these values will immediately be propagated
  private userId: string;
  private username: string;
  private spiritAnimal: string;
  private authStatusListener: Subject<boolean> = new Subject<boolean>();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private localStorageService: LocalStorageService
  ) {}

  /**
   * Gets the token (JWT) of the logged-in user.
   * @returns The JWT as a string.
   */
  getToken(): string {
    return this.token;
  }

  /**
   * Gets the UUID of the logged-in user.
   * @returns The UUID of the logged-in user.
   */
  getUserId(): string {
    return this.userId;
  }

  /**
   * Gets the username of the logged-in user.
   * @returns The username of the logged-in user.
   */
  getUsername(): string {
    return this.username;
  }

  /**
   * Gets the "Spirit Animal" enum representing the avatar of the logged-in user.
   * @returns The string value of the SpiritAnimal enum.
   */
  getSpiritAnimal(): string {
    return this.spiritAnimal;
  }

  /**
   * Returns an auth observable to listen for auth updates (i.e. logging in and logging out).
   * @return An observable that can be subscribed to know of changes in the user's auth status.
   */
  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  /**
   * Checks if the user is authorized or not.
   * @return True if the user is already authenticated, false otherwise.
   */
  isAuthorized(): boolean {
    return this.isAuthenticated;
  }

  /**
   * Takes user supplied registration information and sends a request to creates a new user in the system.
   * @param signUpDto DTO containing the necessary fields to register an account (i.e. username, email, password, etc.)
   */
  signUp(signUpDto: SignUpDto): void {
    this.httpClient.post<{ message: string }>(`${BACKEND_URL}/signup`, signUpDto).subscribe(
      () => {
        this.snackBar.open(`Your account has been created!`, 'OK', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });

        // TODO: Sign-in the user upon creation
        this.router.navigate(['/auth/signin']);
      },
      (error: any) => {
        this.authStatusListener.next(false);

        if (error.status && error.status === StatusCodes.BAD_REQUEST) {
          // TODO: Need to loop over the response to notify users on the format of their credentials
          this.snackBar.open(
            'Please make sure you register your credentials with the proper format.',
            'Registration Error',
            {
              duration: 3000,
            }
          );
        }
      }
    );
  }

  /**
   * Signs in using a username + password
   * @param DTO containing attempted login info i.e. username and password.
   */
  signin(authCredentials: AuthCredentialDto): void {
    this.httpClient.post(`${BACKEND_URL}/signin`, authCredentials, { withCredentials: true }).subscribe(
      (response: SignInResponseDto) => {
        const token = response.accessToken;
        this.token = token;

        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.username = response.username;
          this.spiritAnimal = response.spiritAnimal;
          this.authStatusListener.next(true);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);

          this.saveAuthData(token, expirationDate, this.userId, this.username, this.spiritAnimal);
          this.router.navigate(['/']);

          this.snackBar.open(`You have successfully signed in.`, 'OK', {
            duration: 3000,
            panelClass: 'success-snackbar',
          });
        }
      },
      (error: any) => {
        this.authStatusListener.next(false);
        if (error.status && error.status === StatusCodes.UNAUTHORIZED) {
          this.snackBar.open(
            `User could not be found. Please try again with other credentials.`,
            'Authorization Error',
            {
              duration: 3000,
            }
          );
        } else {
          throw error;
        }
      }
    );
  }

  /**
   * Logs a user out by nulling the relevant properties and clearing local storage.
   */
  logOut(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.username = null;
    this.spiritAnimal = null;

    this.snackBar.open(`You have logged out.`, 'OK', {
      duration: 3000,
      panelClass: 'success-snackbar',
    });

    this.router.navigate(['/auth/signin']);
  }

  /**
   * Used when initalizing the app to set the auth status of the user.
   */
  setUpAuthStatus(): void {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }

    const now = new Date();
    // Difference between expiration time and current time (will return negative number if already expired)
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      // Token not expired
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.username = authInformation.username;
      this.spiritAnimal = authInformation.spiritAnimal;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  /**
   * Sets the time remaining on the JWT expiration.
   * @param duration The time in seconds to set on the token timer.
   */
  private setAuthTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  /**
   * Saves some basic authentication & non-sensitive user data in local storage.
   * @param token The access token (JWT) of a logged-in user.
   * @param expirationDate The expiration date of the JWT
   * @param userId The UUID of the logged-in user.
   * @param username The username of the logged-in user.
   * @param spiritAnimal The SpiritAnimal enum representing the avatar of the logged-in user.
   */
  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    username: string,
    spiritAnimal: string
  ): void {
    // TODO: Convert this to "this.localStorageService.setItem" for Angular Universal purposes?
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('spiritAnimal', spiritAnimal);
  }

  /**
   * Clears the authentication data from local storage. To be called on logout.
   */
  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('spiritAnimal');
  }

  /**
   * Gets the authentication and user data from local storage if it exists.
   * @returns An object containing the authentication and user data that was fetched from local storage.
   */
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const spiritAnimal = localStorage.getItem('spiritAnimal');

    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      username: username,
      spiritAnimal: spiritAnimal,
    };
  }
}

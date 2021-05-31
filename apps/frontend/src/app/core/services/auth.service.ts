import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusCodes } from '../../shared/utilities/status-codes.enum';
import { AuthCredentialDto, SignUpDto, SignInResponseDto } from '@ratemystocks/api-interface';
import { LocalStorageService } from './local-storage.service';

const BACKEND_URL: string = environment.apiUrl + '/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener: Subject<boolean> = new Subject<boolean>();

  public getLoggedInName = new Subject();

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
   *
   * @returns
   */
  getUserId() {
    return this.userId;
  }

  /**
   * Returns an auth observable to listen for auth updates
   */
  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  /**
   * Checks if the user is authorized by checking rmsAuthExpirationDate from local storage
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
          this.authStatusListener.next(true);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);

          this.saveAuthData(token, expirationDate, this.userId);
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
   *
   */
  logOut(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;

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
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    // TODO: Convert this to "this.localStorageService.setItem"
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
}

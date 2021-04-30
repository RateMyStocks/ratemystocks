import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusCodes } from '../../shared/utilities/status-codes.enum';
import { AuthCredentialDto, UserDto } from '@ratemystocks/api-interface';

const httpUrl: string = environment.apiUrl + '/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuth = false;
  private authStatusListener: Subject<boolean> = new Subject<boolean>();
  public getLoggedInName = new Subject();

  constructor(private httpClient: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

  signUp(user: UserDto): void {
    this.httpClient.post<{ message: string }>(`${httpUrl}/signup`, user).subscribe(
      () => {
        // TODO: Sign-in the user upon creation

        this.snackBar.open(`Your account has been created!`, 'OK', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });

        this.router.navigate(['/auth/signin']);
      },
      (error: any) => {
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
   * Sets a httponly cookie for jwt and puts the expiration on a local storage key value pair
   */
  signin(authCredentials: AuthCredentialDto): void {
    this.httpClient.post(`${httpUrl}/signin`, authCredentials, { withCredentials: true }).subscribe(
      (response: SignInResponse) => {
        this.isAuth = true;
        this.authStatusListener.next(this.isAuth);
        const now: Date = new Date();
        const expiration: Date = new Date(now.getTime() + response.expiresIn * 1000);
        localStorage.setItem('rmsAuthExpirationDate', expiration.toISOString());
        localStorage.setItem('loggedInUsername', authCredentials.username);

        this.router.navigate(['/']);
        this.getLoggedInName.next(authCredentials.username);
        this.snackBar.open(`You have successfully signed in.`, 'OK', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });
      },
      (error: any) => {
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

  logOut() {
    this.invalidateCredentials();
    this.isAuth = false;
    this.authStatusListener.next(this.isAuth);

    this.snackBar.open(`You have logged out.`, 'OK', {
      duration: 3000,
      panelClass: 'success-snackbar',
    });

    this.router.navigate(['/auth/signin']);
  }
  /**
   * Gets the logged-in username from local storage.
   */
  getLoggedUsername(): void {
    this.getLoggedInName.next(localStorage.getItem('loggedInUsername'));
  }

  /**
   * Fetches the users settings
   * (currently just a place holder for testing authentication functionality)
   */
  fetchSettings(): void {
    this.httpClient.get(`${httpUrl}/settings`, { withCredentials: true }).subscribe();
  }

  /**
   * Checks if the user is authorized by checking rmsAuthExpirationDate from local storage
   */
  isAuthorized(): boolean {
    return this.isAuth;
  }

  /**
   * Used when initalizing the app, this removes
   */
  setUpAuthStatus(): void {
    const localStorageExpirationDate: string = localStorage.getItem('rmsAuthExpirationDate');
    if (localStorageExpirationDate === null) {
      this.isAuth = false;
    }
    const expirationDate: Date = new Date(localStorageExpirationDate);
    const currentDate: Date = new Date();

    if (currentDate.getTime() > expirationDate.getTime()) {
      this.invalidateCredentials();
    } else {
      this.isAuth = true;
    }
  }

  /**
   * Invalidates user credentials
   */
  invalidateCredentials(): void {
    localStorage.removeItem('rmsAuthExpirationDate');
    localStorage.removeItem('loggedInUsername');
    this.httpClient.post<{}>(`${httpUrl}/invalidateCookie`, {}, { withCredentials: true }).subscribe();
  }
  /**
   * Returns an auth observable to listen for auth updates
   */
  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }
}

interface SignInResponse {
  expiresIn: number;
}

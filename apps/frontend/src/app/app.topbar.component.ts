import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { AuthService } from './core/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthCredentialDto, ForgotPasswordDto, IexCloudSearchDto, SignUpDto } from '@ratemystocks/api-interface';
import { EMAIL_REGEX, PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE, USERNAME_REGEX } from '@ratemystocks/regex-patterns';
import { EmailFormFieldValidatorPipe } from './shared/pipes/email-form-field-validator.pipe';
import { UsernameFormFieldValidatorPipe } from './shared/pipes/username-form-field-validator.pipe';
import { passwordMatchValidator } from './shared/utilities/form-password-match-validator';
import { Message, MessageService } from 'primeng/api';
import { StockSearchService } from './core/services/stock-search.service';
import { Router } from '@angular/router';

enum AuthModeType {
  LOGIN = 'Login',
  SIGN_UP = 'Sign Up',
  FORGOT_PASSWORD = 'Forgot Password',
}
class AuthMode {
  constructor(public text: string, public type: AuthModeType) {}
}

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit, OnDestroy {
  userName = '';
  avatar = '';
  email = '';
  authStatusSub!: Subscription;
  isAuth = false;
  displayLoginDialog = false;

  formErrorMessages: Message[] = [];

  authModeType = AuthModeType;
  authMode: AuthMode = new AuthMode('Login', AuthModeType.LOGIN);

  loginForm: FormGroup = new FormGroup({
    usernameOrEmail: new FormControl(null, {
      validators: [Validators.required],
    }),
    password: new FormControl(null, {
      validators: [Validators.required],
    }),
  });

  signupForm: FormGroup = new FormGroup(
    {
      username: new FormControl(null, {
        validators: [Validators.required, Validators.pattern(USERNAME_REGEX)],
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.pattern(EMAIL_REGEX)],
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
      }),
      passwordReenter: new FormControl(null, {
        validators: [Validators.required],
      }),
    },
    { validators: passwordMatchValidator }
  );

  forgotPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, {
      validators: [Validators.required, Validators.pattern(EMAIL_REGEX)],
    }),
  });

  filteredStocks: IexCloudSearchDto[];
  selectedStock: IexCloudSearchDto;

  constructor(
    public appMain: AppMainComponent,
    public app: AppComponent,
    private authService: AuthService,
    private messageService: MessageService,
    private stockSearchService: StockSearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuth = this.authService.isAuthorized();
    this.userName = this.authService.getUsername();
    this.email = this.authService.getEmail();
    this.avatar = this.authService.getSpiritAnimal();

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuth = authStatus;
      if (this.isAuth) {
        this.userName = this.authService.getUsername();
        this.avatar = this.authService.getSpiritAnimal();
        this.email = this.authService.getEmail();

        this.displayLoginDialog = false;
      } else {
        // TODO: This is showing up after logout as well. It should only show up when an error occurs.
        this.formErrorMessages = [
          {
            severity: 'error',
            summary: 'Login Failed',
            detail: 'Please ensure your username & password are correct.',
          },
        ];
      }
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  /**
   * Event handler for clicking the logout button in the navbar.
   * Calls the backend to log the user out of the system.
   */
  logOut(): void {
    this.authService.logOut();
  }

  /**
   * Event handler for when a user clicks the link to switch the "Auth Mode"
   * i.e. if they are in the Login form but want to Sign Up or Reset their password instead.
   * @param authModeType The "Auth Mode" e.g. Login, Sign Up, or Forgot Password.
   */
  showLoginDialog(authModeType: AuthModeType) {
    this.displayLoginDialog = true;
    this.authMode = new AuthMode(authModeType, authModeType);
  }

  /**
   * Event handler for when the user clicks the submit button on the Login form.
   * Sends a request to the backend to login to their account.
   */
  onSubmitLoginForm(): void {
    // If the input for the usernameOrEmail field has an @ symbol, they are attempting to login with email.
    const username = this.loginForm.value.usernameOrEmail.includes('@') ? null : this.loginForm.value.usernameOrEmail;
    const email = this.loginForm.value.usernameOrEmail.includes('@') ? this.loginForm.value.usernameOrEmail : null;

    const credentials: AuthCredentialDto = {
      username,
      email,
      password: this.loginForm.value.password,
    };

    this.authService.signin(credentials);
  }

  /**
   * Event handler for when the user clicks the submit button on the Sign Up form.
   * Sends a request to the backend to create their account.
   */
  onSubmitSignupForm(): void {
    const user: SignUpDto = {
      username: this.signupForm.value.username,
      password: this.signupForm.value.password,
      email: this.signupForm.value.email,
    };
    this.authService.signUp(user);
  }

  /**
   * Event handler for when the user clicks the submit button on the Forgot Password form.
   * Sends a request to the backend to send an email to the user to reset their password.
   */
  onSubmitForgotPassword(): void {
    const email = this.forgotPasswordForm.value.email.includes('@') ? this.forgotPasswordForm.value.email : null;

    this.authService.forgotPassword(email).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: `An email to reset your password was sent to ${email}!`,
        });
        this.displayLoginDialog = false;
      },
      (error) => {
        this.formErrorMessages = [
          {
            severity: 'error',
            summary: 'Error!',
            detail: `An error occurred resetting your password. Please try again or contact us if the issue persists.`,
          },
        ];
      }
    );
  }

  /**
   * Toggles whether the UI should display the Login, Sign Up, or Forgot Password form.
   * @param type The "Auth Mode" e.g. Login, Sign Up, Forgot Password.
   */
  setAuthMode(type: AuthModeType): void {
    this.authMode.type = type;
    this.authMode = new AuthMode(type, type);
  }

  /*
   * Sets errors on the passwordRenter field if the passwords don't match.
   * Called on each input in either password field
   */
  onPasswordInput(): void {
    if (this.signupForm.hasError('passwordMismatch')) {
      this.signupForm.get('passwordReenter').setErrors([{ passwordMismatch: true }]);
    } else {
      this.signupForm.get('passwordReenter').setErrors(null);
    }
  }

  /**
   * Gets the appropriate error message for the 'password' form field.
   * @return The error message based on the user input of the 'password' field.
   */
  getErrorPassword() {
    return this.signupForm.get('password').hasError('required')
      ? 'Password is required.'
      : this.signupForm.get('password').hasError('pattern')
      ? PASSWORD_VALIDATION_MESSAGE
      : '';
  }

  /**
   * Gets the appropriate error message for the 'passwordReenter' form field.
   * @return The error message based on the user input of the 'passwordReenter' field.
   */
  getErrorPasswordReenter() {
    return this.signupForm.get('passwordReenter').hasError('required')
      ? 'Please confirm your password.'
      : this.signupForm.get('passwordReenter').invalid
      ? 'Password does not match.'
      : '';
  }

  /**
   * Event handler for when a user types into the stock search autocomplete field.
   * Calls the stock API to search for stocks by ticker symbol or company name.
   * @param event An object representing the event of a user entering input into the stock search field.
   */
  searchStocks(event: { originalEvent: InputEvent; query: string }): void {
    this.stockSearchService.searchStocks(event.query).subscribe((result: IexCloudSearchDto[]) => {
      this.filteredStocks = result;
    });
  }

  /**
   * Event handelr for when a stock is selected in the stock search autocomplete field
   * that redirects to the stock page.
   * @param selectStock The object representing the selected stock.
   */
  onSelectStock(selectStock: IexCloudSearchDto): void {
    const tickerSymbol: string = selectStock.symbol;

    this.router.navigate(['/stocks', tickerSymbol]);
  }

  /**
   * Wraps the matching search text with a <mark> element to highlight it.
   * @param term The entered search term.
   * @param result The result from the stock search.
   * @return The updated string with the matched text highlighted.
   */
  highlightMatchingSearchText(term: string, result: string): string {
    return result.replace(new RegExp(term, 'gi'), (match: string) => `<mark>${match}</mark>`);
  }

  // showCaptchaResponse(event: unknown) {}
}

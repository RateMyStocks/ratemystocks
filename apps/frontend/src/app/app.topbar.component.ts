import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { AuthService } from './core/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthCredentialDto, SignUpDto } from '@ratemystocks/api-interface';
import { EMAIL_REGEX, PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE, USERNAME_REGEX } from '@ratemystocks/regex-patterns';
import { EmailFormFieldValidatorPipe } from './shared/pipes/email-form-field-validator.pipe';
import { UsernameFormFieldValidatorPipe } from './shared/pipes/username-form-field-validator.pipe';
import { passwordMatchValidator } from './shared/utilities/form-password-match-validator';

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
export class AppTopBarComponent implements OnInit {
  userName: string = '';
  avatar: string = '';
  email: string = '';
  authStatusSub!: Subscription;
  isAuth: boolean = false;
  displayLoginDialog: boolean = false;

  isLoading = false;

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

  constructor(public appMain: AppMainComponent, public app: AppComponent, private authService: AuthService) {}

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
      }
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  logOut(): void {
    this.authService.logOut();
  }

  showLoginDialog(authModeType: AuthModeType) {
    this.displayLoginDialog = true;
    this.authMode = new AuthMode(authModeType, authModeType);
  }

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

  onSubmitSignupForm(): void {
    const user: SignUpDto = {
      username: this.signupForm.value.username,
      password: this.signupForm.value.password,
      email: this.signupForm.value.email,
    };
    this.authService.signUp(user);
  }

  setAuthMode(type: AuthModeType) {
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
  // showCaptchaResponse(event: unknown) {}
}

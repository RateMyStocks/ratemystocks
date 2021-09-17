import { Component } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SignUpDto } from '@ratemystocks/api-interface';
import {
  USERNAME_REGEX,
  EMAIL_REGEX,
  PASSWORD_REGEX,
  USERNAME_VALIDATION_MESSAGE,
  EMAIL_VALIDATION_MESSAGE,
  PASSWORD_VALIDATION_MESSAGE,
} from '@ratemystocks/regex-patterns';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../../components/auth-form/auth-form.component.scss', './sign-up.component.scss'],
})
export class SignUpComponent extends AuthFormComponent {
  constructor(authService: AuthService, router: Router) {
    super(authService, router);

    this.buttonLabel = 'Sign Up';

    this.form = new FormGroup(
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
  }

  /** Shorthand for form controls. Can be used in this component as this.username or in template as username */
  get username() {
    return this.form.get('username');
  }

  /** Shorthand for form controls. Can be used in this component as this.email or in template as email */
  get email() {
    return this.form.get('email');
  }

  /** Shorthand for form controls. Can be used in this component as this.password or in template as password */
  get password() {
    return this.form.get('password');
  }

  /** Shorthand for form controls. Can be used in this component as this.passwordReenter or in template as passwordReenter */
  get passwordReenter() {
    return this.form.get('passwordReenter');
  }

  /**
   * Gets the appropriate error message for the 'username' form field.
   * @return The error message based on the user input of the 'username' field.
   */
  getErrorUsername(): string {
    return this.username.hasError('required')
      ? 'Username is required.'
      : this.username.hasError('pattern')
      ? USERNAME_VALIDATION_MESSAGE
      : // : this.form.get('email').hasError('alreadyInUse')
        // ? 'This emailaddress is already in use'
        '';
  }

  /**
   * Gets the appropriate error message for the 'email' form field.
   * @return The error message based on the user input of the 'email' field.
   */
  getErrorEmail(): string {
    return this.email.hasError('required')
      ? 'Email is required.'
      : this.email.hasError('pattern')
      ? EMAIL_VALIDATION_MESSAGE
      : // : this.form.get('email').hasError('alreadyInUse')
        // ? 'This emailaddress is already in use'
        '';
  }

  /**
   * Gets the appropriate error message for the 'password' form field.
   * @return The error message based on the user input of the 'password' field.
   */
  getErrorPassword() {
    return this.password.hasError('required')
      ? 'Password is required.'
      : this.password.hasError('pattern')
      ? PASSWORD_VALIDATION_MESSAGE
      : '';
  }

  /**
   * Gets the appropriate error message for the 'passwordReenter' form field.
   * @return The error message based on the user input of the 'passwordReenter' field.
   */
  getErrorPasswordReenter() {
    return this.passwordReenter.hasError('required')
      ? 'Please confirm your password.'
      : this.passwordReenter.invalid
      ? 'Password does not match.'
      : '';
  }

  /*
   * Sets errors on the passwordRenter field if the passwords don't match.
   * Called on each input in either password field
   */
  onPasswordInput(): void {
    if (this.form.hasError('passwordMismatch')) {
      this.passwordReenter.setErrors([{ passwordMismatch: true }]);
    } else {
      this.passwordReenter.setErrors(null);
    }
  }

  /**
   *
   * @param control
   */
  checkInUseEmail(control) {
    // mimic http database access
    // let db = ['tony@gmail.com'];
    // return new Observable(observer => {
    //   setTimeout(() => {
    //     let result = (db.indexOf(control.value) !== -1) ? { 'alreadyInUse': true } : null;
    //     observer.next(result);
    //     observer.complete();
    //   }, 4000)
    // })
  }

  /** Makes a POST a request to create the new user given the form data. */
  submitForm(): void {
    this.isLoading = true;
    const user: SignUpDto = {
      username: this.form.value.username,
      password: this.form.value.password,
      email: this.form.value.email,
    };
    this.authService.signUp(user);
  }
}

/**
 * Validator function that ensures 'password' form field has the same value as the 're-enter password' field.
 * @param formGroup The signup form containing the password fields.
 * @return The ValidationErrors object if the passwords don't match, otherwise return null.
 */
export const passwordMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
  if (formGroup.get('password').value === formGroup.get('passwordReenter').value) return null;
  else return { passwordMismatch: true };
};

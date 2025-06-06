import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ChangePasswordDto } from '@ratemystocks/api-interface';
import { PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE } from '@ratemystocks/regex-patterns';
import { AuthService } from '../core/services/auth.service';
import { passwordMatchValidator } from '../shared/utilities/form-password-match-validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './app.resetpassword.component.html',
})
export class AppResetPasswordComponent {
  form = new FormGroup(
    {
      password: new FormControl(null, {
        validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)],
      }),
      passwordReenter: new FormControl(null, {
        validators: [Validators.required],
      }),
    },
    { validators: passwordMatchValidator }
  );

  /**
   *
   */
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthService) {}

  /** Shorthand for form controls. Can be used in this component as this.password or in template as password */
  get password() {
    return this.form.get('password');
  }

  /** Shorthand for form controls. Can be used in this component as this.passwordReenter or in template as passwordReenter */
  get passwordReenter() {
    return this.form.get('passwordReenter');
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

  /** Makes a POST a request to change the password. */
  submitForm(): void {
    this.activatedRoute.paramMap.subscribe(
      (paramMap: ParamMap) => {
        const userId = paramMap.get('userid');
        const token = paramMap.get('token');

        const changePasswordDto: ChangePasswordDto = {
          password: this.form.value.password,
          password2: this.form.value.passwordReenter,
        };

        this.authService.resetPassword(userId, token, changePasswordDto).subscribe(
          () => {
            this.router.navigate(['/login']);
            // this.matSnackBar.open('Your password has been successfully reset!', 'OK', {
            //   duration: 2000,
            //   panelClass: 'success-snackbar',
            // });
          },
          () => {
            // this.isLoading = false;
          }
        );
      },
      () => {
        // this.isLoading = false;
      }
    );
  }
}

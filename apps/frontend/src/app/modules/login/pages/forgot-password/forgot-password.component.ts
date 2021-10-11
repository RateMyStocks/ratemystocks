import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { Router } from '@angular/router';
import { ForgotPasswordDto } from '@ratemystocks/api-interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMAIL_REGEX, EMAIL_VALIDATION_MESSAGE } from '@ratemystocks/regex-patterns';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../components/auth-form/auth-form.component.scss', './forgot-password.component.scss'],
})
export class ForgotPasswordComponent extends AuthFormComponent {
  emailSent = false;

  constructor(authService: AuthService, router: Router, private matSnackBar: MatSnackBar) {
    super(authService, router);

    this.buttonLabel = 'Reset Password';
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.pattern(EMAIL_REGEX)],
      }),
    });
  }

  submitForm(): void {
    const email = this.form.value.email.includes('@') ? this.form.value.email : null;

    const credentials: ForgotPasswordDto = {
      email,
    };

    this.authService.forgotPassword(email).subscribe(
      () => {
        this.matSnackBar.open(`An email to reset your password was sent to ${email}!`, 'OK', {
          duration: 2000,
          panelClass: 'success-snackbar',
        });

        this.emailSent = true;
      },
      (error) => {
        this.matSnackBar.open(`There is no account associated with ${email}.`, 'OK', {
          duration: 2000,
          panelClass: 'success-snackbar',
        });
      }
    );
  }

  /** Shorthand for form controls. Can be used in this component as this.email or in template as email */
  get email() {
    return this.form.get('email');
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
}

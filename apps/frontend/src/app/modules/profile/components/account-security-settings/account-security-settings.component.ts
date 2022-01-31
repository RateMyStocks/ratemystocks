import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangePasswordDto } from '@ratemystocks/api-interface';
import { PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE } from '@ratemystocks/regex-patterns';
import { passwordMatchValidator } from '../../../../shared/utilities/form-password-match-validator';
import { AuthService } from '../../../../core/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-account-security-settings',
  templateUrl: './account-security-settings.component.html',
  styleUrls: ['./account-security-settings.component.scss'],
})
export class AccountSecuritySettingsComponent {
  hidePassword = true;

  form: FormGroup = new FormGroup(
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

  constructor(private authService: AuthService, private messageService: MessageService) {}

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

  submitForm(): void {
    const changePasswordDto: ChangePasswordDto = {
      password: this.form.value.password,
      password2: this.form.value.passwordReenter,
    };

    this.authService.changePassword(changePasswordDto).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Password Updated!',
        detail: `Your password has been successfully reset.`,
      });
    });
  }
}

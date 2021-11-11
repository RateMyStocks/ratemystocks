import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserSettingsDto } from '@ratemystocks/api-interface';
import { EMAIL_REGEX, EMAIL_VALIDATION_MESSAGE } from '@ratemystocks/regex-patterns';
import { AuthService } from '../../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-email-form',
  templateUrl: './change-email-form.component.html',
  styleUrls: ['./change-email-form.component.scss'],
})
export class ChangeEmailFormComponent implements OnInit {
  authStatusSub: Subscription;
  isAuth: boolean;
  settings: UserSettingsDto;

  emailVerified = false;

  isLoading = false;
  form: FormGroup = new FormGroup({
    email: new FormControl(null, {
      validators: [Validators.required, Validators.pattern(EMAIL_REGEX)],
    }),
  });

  constructor(private authService: AuthService, private matSnackBar: MatSnackBar, private router: Router) {}

  ngOnInit(): void {
    this.isAuth = this.authService.isAuthorized();
    if (this.isAuth) {
      this.authService.getSettings().subscribe((settings: UserSettingsDto) => {
        this.settings = settings;

        this.form.setValue({ email: settings.email });
        this.emailVerified = settings.emailVerified;
      });
    } else {
      this.router.navigate(['/auth/signin']);
    }

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuth = authStatus;
      if (this.isAuth) {
        this.authService.getSettings().subscribe((settings: UserSettingsDto) => {
          this.settings = settings;

          this.form.setValue({ email: settings.email });
          this.emailVerified = settings.emailVerified;
        });
      } else {
        this.router.navigate(['/auth/signin']);
      }
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
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

  /**
   * Submits the form, sending a request to the backend to update the User settings
   */
  submitForm(): void {
    this.isLoading = true;
    const userSettings: UserSettingsDto = {
      email: this.form.value.email,
      emailVerified: false, // this is set in the backend to false regardless of what is sent in
    };
    this.authService.updateSettings(userSettings).subscribe(() => {
      this.emailVerified = false;

      this.matSnackBar.open(`Profile settings updated!`, 'OK', {
        duration: 2000,
        panelClass: 'success-snackbar',
      });
    });
  }

  /**
   * Resends an email to a user allowing them to verify their email address.
   * @param emailVerificationInfoDto The DTO containing info necessary to email the user.
   */
  resendEmailVerification(): void {
    const emailVerificationInfoDto: { userId: string; username: string; email: string } = {
      userId: this.authService.getUserId(),
      username: this.authService.getUsername(),
      email: this.form.value.email,
    };
    this.authService.sendVerificationEmail(emailVerificationInfoDto);

    this.matSnackBar.open(`Email verification sent to ${this.form.value.email}!`, 'OK', {
      duration: 2000,
      panelClass: 'success-snackbar',
    });
  }
}

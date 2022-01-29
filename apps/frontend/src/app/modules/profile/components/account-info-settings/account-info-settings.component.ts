import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMAIL_REGEX, EMAIL_VALIDATION_MESSAGE } from '@ratemystocks/regex-patterns';
import { Subscription } from 'rxjs';
import { UserSettingsDto } from '@ratemystocks/api-interface';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-account-info-settings',
  templateUrl: './account-info-settings.component.html',
  styleUrls: ['./account-info-settings.component.scss'],
})
export class AccountInfoSettingsComponent implements OnInit, OnDestroy {
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

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {}

  ngOnInit(): void {
    this.isAuth = this.authService.isAuthorized();
    if (this.isAuth) {
      this.authService.getSettings().subscribe((settings: UserSettingsDto) => {
        this.settings = settings;

        this.form.setValue({ email: settings.email });
        this.emailVerified = settings.emailVerified;
      });
    } else {
      // TODO: When using the Angular router to go to the loading page, for some reason some HTML & CSS isn't loading/displaying
      // this.router.navigate(['/login']);
      window.location.assign('/login');
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
        // TODO: When using the Angular router to go to the loading page, for some reason some HTML & CSS isn't loading/displaying
        // this.router.navigate(['/login']);
        window.location.assign('/login');
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

      this.messageService.add({
        severity: 'success',
        summary: 'Email Updated!',
        detail: `Email verification sent to ${this.form.value.email}!`,
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

    this.messageService.add({
      severity: 'success',
      summary: 'Verification Email Sent!',
      detail: `Email verification sent to ${this.form.value.email}!`,
    });
  }
}

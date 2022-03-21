import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { SignUpDto } from '@ratemystocks/api-interface';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { EMAIL_REGEX, PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE, USERNAME_REGEX } from '@ratemystocks/regex-patterns';
import { passwordMatchValidator } from '../shared/utilities/form-password-match-validator';

@Component({
  selector: 'app-signup',
  templateUrl: 'app.signup.component.html',
})
export class AppSignupComponent implements OnInit {
  authStatusSub!: Subscription;
  isAuth = false;

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

  constructor(private authService: AuthService, private router: Router, private meta: Meta, private title: Title) {
    this.title.setTitle('Sign Up - ratemystocks.com');

    this.meta.addTags([
      {
        name: 'description',
        content: `Register to create a free account with ratemystocks.com to discuss your favorite stocks with investors around the world.`,
      },
      {
        name: 'keywords',
        content: `ratemystocks.com signup, ratemystocks.com signup, ratemystocks.com sign up`,
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ]);
  }

  ngOnInit(): void {
    this.isAuth = this.authService.isAuthorized();

    if (this.isAuth) {
      this.router.navigate(['/']);
    }

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuth = authStatus;
    });
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
    this.authService.signUp(user, true);
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
}

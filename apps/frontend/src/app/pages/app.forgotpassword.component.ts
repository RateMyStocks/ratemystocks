import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { EMAIL_REGEX } from '@ratemystocks/regex-patterns';
import { MessageService } from 'primeng/api';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './app.forgotpassword.component.html',
})
export class AppForgotPasswordComponent {
  forgotPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, {
      validators: [Validators.required, Validators.pattern(EMAIL_REGEX)],
    }),
  });

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private meta: Meta,
    private title: Title
  ) {
    this.title.setTitle('Reset Password - ratemystocks.com');

    this.meta.addTags([
      {
        name: 'description',
        content: `Forgot your password? Reset your password so you can login to ratemystocks.com to discuss your favorite stocks with investors around the world.`,
      },
      {
        name: 'keywords',
        content: `ratemystocks.com forgot password, ratemystocks.com reset password, ratemystocks.com password reset`,
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ]);
  }

  onSubmitForgotPassword(): void {
    const email = this.forgotPasswordForm.value.email.includes('@') ? this.forgotPasswordForm.value.email : null;

    this.authService.forgotPassword(email).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: `An email to reset your password was sent to ${email}!`,
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Oh noes!',
          detail: `An error occurred resetting your password. Please try again or contact us if the issue persists!`,
        });
      }
    );
  }
}

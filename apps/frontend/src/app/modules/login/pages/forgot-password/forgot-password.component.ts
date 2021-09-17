import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../components/auth-form/auth-form.component.scss', './forgot-password.component.scss'],
})
export class ForgotPasswordComponent extends AuthFormComponent {
  constructor(authService: AuthService, router: Router) {
    super(authService, router);

    this.buttonLabel = 'Reset Password';
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  submitForm(): void {
    // TODO: Implement this POST Request
    console.log('NOOP');
  }
}

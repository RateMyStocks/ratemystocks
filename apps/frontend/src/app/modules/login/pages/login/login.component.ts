import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthCredentialDto } from '@ratemystocks/api-interface';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../components/auth-form/auth-form.component.scss', './login.component.scss'],
})
export class LoginComponent extends AuthFormComponent {
  constructor(authService: AuthService, router: Router) {
    super(authService, router);

    this.buttonLabel = 'Login';

    this.form = new FormGroup({
      usernameOrEmail: new FormControl(null, {
        validators: [Validators.required],
      }),
      password: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  submitForm(): void {
    // If the input for the usernameOrEmail field has an @ symbol, they are attempting to login with email.
    const username = this.form.value.usernameOrEmail.includes('@') ? null : this.form.value.usernameOrEmail;
    const email = this.form.value.usernameOrEmail.includes('@') ? this.form.value.usernameOrEmail : null;

    const credentials: AuthCredentialDto = {
      username,
      email,
      password: this.form.value.password,
    };
    this.isLoading = true;
    this.authService.signin(credentials);
  }
}

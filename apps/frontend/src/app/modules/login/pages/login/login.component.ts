import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthCredentialDto } from '@ratemystocks/api-interface';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../components/auth-form/auth-form.component.scss', './login.component.scss'],
})
export class LoginComponent extends AuthFormComponent {
  constructor(authService: AuthService) {
    super(authService);

    this.buttonLabel = 'Login';

    this.form = new FormGroup({
      username: new FormControl(null, {
        validators: [Validators.required],
      }),
      password: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  submitForm(): void {
    const credentials: AuthCredentialDto = {
      username: this.form.value.username,
      password: this.form.value.password,
    };
    this.isLoading = true;
    this.authService.signin(credentials);
  }
}

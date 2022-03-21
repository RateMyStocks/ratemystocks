import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthCredentialDto } from '@ratemystocks/api-interface';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
})
export class AppLoginComponent implements OnInit {
  authStatusSub!: Subscription;
  isAuth = false;

  loginForm: FormGroup = new FormGroup({
    usernameOrEmail: new FormControl(null, {
      validators: [Validators.required],
    }),
    password: new FormControl(null, {
      validators: [Validators.required],
    }),
  });

  constructor(private authService: AuthService, private router: Router, private meta: Meta, private title: Title) {
    this.title.setTitle('Login - ratemystocks.com');

    this.meta.addTags([
      {
        name: 'description',
        content: `Login to ratemystocks.com to discuss your favorite stocks with investors around the world.`,
      },
      {
        name: 'keywords',
        content: `ratemystocks.com login, ratemystocks.com signin, ratemystocks.com sign in`,
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
   * Handler for clicking the "Login" button. Submits a login POST request to the server.
   */
  onSubmitLoginForm(): void {
    // If the input for the usernameOrEmail field has an @ symbol, they are attempting to login with email.
    const username = this.loginForm.value.usernameOrEmail.includes('@') ? null : this.loginForm.value.usernameOrEmail;
    const email = this.loginForm.value.usernameOrEmail.includes('@') ? this.loginForm.value.usernameOrEmail : null;

    const credentials: AuthCredentialDto = {
      username,
      email,
      password: this.loginForm.value.password,
    };

    this.authService.signin(credentials, false, true);
  }
}

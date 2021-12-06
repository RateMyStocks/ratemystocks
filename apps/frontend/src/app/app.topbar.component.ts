import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthCredentialDto } from '@ratemystocks/api-interface';
import { Subscription } from 'rxjs';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit {
  userName: string;
  avatar: string;
  email: string;
  authStatusSub: Subscription;
  isAuth: boolean;
  displayLoginDialog: boolean = false;

  // TODO: Move this into it's own component
  loginForm: FormGroup = null;
  isLoading = false;

  constructor(
    public appMain: AppMainComponent,
    public app: AppComponent,
    private authService: AuthService // private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.isAuth = this.authService.isAuthorized();
    this.userName = this.authService.getUsername();
    this.email = this.authService.getEmail();
    this.avatar = this.authService.getSpiritAnimal();

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuth = authStatus;
      if (this.isAuth) {
        this.userName = this.authService.getUsername();
        this.avatar = this.authService.getSpiritAnimal();
        this.email = this.authService.getEmail();

        this.displayLoginDialog = false;
      }
    });

    // TODO: Move this into it's own component
    this.loginForm = new FormGroup({
      usernameOrEmail: new FormControl(null, {
        validators: [Validators.required],
      }),
      password: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  logOut(): void {
    this.authService.logOut();
  }

  showLoginDialog() {
    this.displayLoginDialog = true;
  }

  // TODO: Move this into it's own component
  onSubmitLoginForm(): void {
    // If the input for the usernameOrEmail field has an @ symbol, they are attempting to login with email.
    const username = this.loginForm.value.usernameOrEmail.includes('@') ? null : this.loginForm.value.usernameOrEmail;
    const email = this.loginForm.value.usernameOrEmail.includes('@') ? this.loginForm.value.usernameOrEmail : null;

    const credentials: AuthCredentialDto = {
      username,
      email,
      password: this.loginForm.value.password,
    };
    this.isLoading = true;

    this.authService.signin(credentials);
  }

  showCaptchaResponse(event: unknown) {}
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

/** Base/Parent component for auth forms (login, signup, forgot password, etc.) */
@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  buttonLabel: string;
  isLoading = false;
  url: string;
  isAuth = false;

  private authStatusSub: Subscription;

  constructor(protected authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuth = this.authService.isAuthorized();

    // If user is already logged-in, redirect to the homepage
    if (this.isAuth) {
      this.router.navigate(['/']);
    }

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isLoading = false;
      this.isAuth = authStatus;

      // If user is already logged-in, redirect to the homepage
      if (this.isAuth) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}

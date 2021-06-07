import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Subscription } from 'rxjs';

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

  private authStatusSub: Subscription;

  constructor(protected authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(() => {
      this.isLoading = false;
    });

    // TODO: If authService.isAuth, redirect to homepage
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}

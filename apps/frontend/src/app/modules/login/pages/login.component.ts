import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthCredentialDto, UserDto } from '@ratemystocks/api-interface';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  buttonLabel: string;
  mode: string;
  isLoading = false;

  private authStatusSub: Subscription;

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(() => {
      this.isLoading = false;
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.form = new FormGroup({
        email: new FormControl(null, {
          validators: [Validators.required],
        }),
      });

      this.mode = paramMap.get('mode');
      switch (this.mode) {
        case 'signin': {
          this.buttonLabel = 'Sign in';
          this.form.addControl(
            'username',
            new FormControl(null, {
              validators: [Validators.required],
            })
          );
          this.form.addControl(
            'password',
            new FormControl(null, {
              validators: [Validators.required],
            })
          );
          break;
        }
        case 'register': {
          this.buttonLabel = 'Register';
          this.form.addControl(
            'username',
            new FormControl(null, {
              validators: [Validators.required],
            })
          );
          this.form.addControl(
            'passwordReenter',
            new FormControl(null, {
              validators: [Validators.required],
            })
          );
          this.form.addControl(
            'email',
            new FormControl(null, {
              validators: [Validators.required],
            })
          );
          this.form.addControl(
            'password',
            new FormControl(null, {
              validators: [Validators.required],
            })
          );
          break;
        }
        case 'reset': {
          this.form.addControl(
            'email',
            new FormControl(null, {
              validators: [Validators.required],
            })
          );
          this.buttonLabel = 'Reset My Password';
        }
      }
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  submitForm(): void {
    if (this.mode === 'register') {
      const user: UserDto = {
        username: this.form.value.username,
        password: this.form.value.password,
        email: this.form.value.email,
      };
      this.authService.signUp(user);
    } else if (this.mode === 'signin') {
      const credentials: AuthCredentialDto = {
        username: this.form.value.username,
        password: this.form.value.password,
      };
      this.isLoading = true;
      this.authService.signin(credentials);
    } else if (this.mode === 'reset') {
      // TODO implement reset logic
    }
  }
}

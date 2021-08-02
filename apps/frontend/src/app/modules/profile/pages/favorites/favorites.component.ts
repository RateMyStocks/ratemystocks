import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  authStatusSub: Subscription;
  isAuth: boolean;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuth = this.authService.isAuthorized();

    if (!this.isAuth) {
      this.router.navigate(['/auth/signin']);
    }

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuth = authStatus;
      if (!this.isAuth) {
        this.router.navigate(['/auth/signin']);
      }
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}

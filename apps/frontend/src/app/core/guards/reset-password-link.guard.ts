import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ResetPasswordLinkGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userId = route.paramMap.get('userid');
    const token = route.paramMap.get('token');

    this.authService.validateUserResetPassword(userId, token).subscribe(
      () => {
        return true;
      },
      (error) => {
        this.router.navigate(['not-found']);
        return false;
      }
    );

    return true;
  }
}

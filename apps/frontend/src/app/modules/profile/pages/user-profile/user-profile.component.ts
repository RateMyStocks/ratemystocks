import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserProfileDto } from '@ratemystocks/api-interface';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  isAuth: boolean;
  authStatusSub: Subscription;
  userLoaded: boolean;
  user: UserProfileDto;
  belongsToLoggedInUser: boolean;

  moment = moment;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuth = this.authService.isAuthorized();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuth = authStatus;
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const username = paramMap.get('username');

      this.userService.getUserByUsername(username).subscribe(
        (user: UserProfileDto) => {
          this.user = user;

          this.userLoaded = true;
        },
        (error: any) => {
          this.router.navigate(['not-found']);
        }
      );
    });

    // if (this.isAuth) {
    //   this.userService.getSavedPortfoliosForUser().subscribe((savedPortfolios: any) => {
    //     console.log(savedPortfolios);
    //   });
    // }
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}

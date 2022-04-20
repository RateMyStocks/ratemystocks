import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
// import { AppMainComponent } from '../../../../app.main.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ProductService } from '../../../../core/services/productservice';
import { UserService } from '../../../../core/services/user.service';
import { Product } from '../../../../shared/models/product';
import { UserProfileDto } from '@ratemystocks/api-interface';
import * as moment from 'moment';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

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
  followers = 0;
  following = 0;

  memberSinceDate!: string;

  // asyncUser: Observable<UserProfileDto>;

  moment = moment;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private breadcrumbService: AppBreadcrumbService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.isAuth = this.authService.isAuthorized();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuth = authStatus;
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const username = paramMap.get('username');

      // this.asyncUser = this.userService.getUserByUsername(username);

      this.userService.getUserByUsername(username).subscribe(
        (user: UserProfileDto) => {
          this.user = user;

          this.memberSinceDate = moment(user.dateJoined).fromNow();

          this.userLoaded = true;

          this.breadcrumbService.setItems([
            { label: 'Profile' },
            { label: this.user.username, routerLink: ['/profile/users/' + user.username] },
          ]);
        },
        (error: any) => {
          this.router.navigate(['not-found']);
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}

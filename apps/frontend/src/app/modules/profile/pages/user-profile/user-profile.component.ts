import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserProfileDto } from '@ratemystocks/api-interface';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  isAuth: boolean;
  userLoaded: boolean;
  user: UserProfileDto;

  constructor(private authService: AuthService, private userService: UserService, private route: ActivatedRoute) {
    this.isAuth = this.authService.isAuthorized();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const username = paramMap.get('username');

      this.userService.getUserByUsername(username).subscribe((user: UserProfileDto) => {
        this.user = user;

        this.userLoaded = true;
      });
    });
  }
}

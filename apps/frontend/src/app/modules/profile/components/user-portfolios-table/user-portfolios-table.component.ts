import { Input, OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { UserPortfolioDto, UserProfileDto } from '@ratemystocks/api-interface';
import { AuthService } from '../../../../core/services/auth.service';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import moment = require('moment');
import { Subscription } from 'rxjs';

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-user-portfolios-table',
  templateUrl: './user-portfolios-table.component.html',
  styleUrls: ['./user-portfolios-table.component.scss'],
})
export class UserPortfoliosTableComponent implements OnInit, OnDestroy {
  isAuth: boolean;
  authStatusSub: Subscription;
  loggedInUserId: string;

  @Input() user: UserProfileDto;

  displayedColumns: string[] = [
    'name',
    'num_likes',
    'num_dislikes',
    'num_holdings',
    'largest_holding',
    'last_updated',
    'actions',
  ];
  dataSource = null;

  moment = moment;

  portfoliosLoaded = false;

  constructor(private portfolioService: PortfolioService, private authService: AuthService) {}

  ngOnInit() {
    this.isAuth = this.authService.isAuthorized();
    this.loggedInUserId = this.authService.getUserId();

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuth = authStatus;
      if (this.isAuth) {
        this.loggedInUserId = this.authService.getUserId();
      }
    });

    this.portfolioService.getPortfoliosByUserId(this.user.id).subscribe((portfolios: UserPortfolioDto[]) => {
      this.portfoliosLoaded = true;

      this.dataSource = portfolios;
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}

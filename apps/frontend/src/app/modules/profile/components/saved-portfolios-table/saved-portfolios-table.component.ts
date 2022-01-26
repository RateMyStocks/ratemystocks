import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PortfolioDto, UserPortfolioDto } from '@ratemystocks/api-interface';
import * as moment from 'moment';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-saved-portfolios-table',
  templateUrl: './saved-portfolios-table.component.html',
  styleUrls: ['./saved-portfolios-table.component.scss'],
})
export class SavedPortfoliosTableComponent implements OnInit {
  getPortfoliosSub: Subscription;
  loggedInUserId: string;

  portfolios = [];

  moment = moment;

  portfoliosLoaded = false;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getPortfoliosSub = this.userService.getSavedPortfoliosForUser().subscribe((response: PortfolioDto[]) => {
      this.portfolios = response;
    });
  }

  ngOnDestroy(): void {
    this.getPortfoliosSub.unsubscribe();
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { PortfolioDto, UserPortfolioDto } from '@ratemystocks/api-interface';
import { UserService } from '../../../../core/services/user.service';
import moment = require('moment');
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-saved-portfolios-table',
  templateUrl: './saved-portfolios-table.component.html',
  styleUrls: ['./saved-portfolios-table.component.scss'],
})
export class SavedPortfoliosTableComponent implements OnInit {
  getPortfoliosSub: Subscription;
  loggedInUserId: string;

  @Input() user: UserPortfolioDto;

  displayedColumns: string[] = ['name', 'description'];
  dataSource = null;

  moment = moment;

  portfoliosLoaded = false;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getPortfoliosSub = this.userService.getSavedPortfoliosForUser().subscribe((response: PortfolioDto[]) => {
      this.dataSource = response;
    });
  }

  ngOnDestroy(): void {
    this.getPortfoliosSub.unsubscribe();
  }

  trimDescription(description: string): string {
    const maxDisplayLength = 200;
    return description.length > maxDisplayLength ? description.substring(0, maxDisplayLength) + '...' : description;
  }
}

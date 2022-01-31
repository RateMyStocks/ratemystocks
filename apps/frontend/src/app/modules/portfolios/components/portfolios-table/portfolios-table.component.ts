import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListPortfoliosDto } from '@ratemystocks/api-interface';
import * as moment from 'moment';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { SortDirection } from '../../../../shared/models/enums/sort-direction';

@Component({
  selector: 'app-portfolios-table',
  templateUrl: './portfolios-table.component.html',
  styleUrls: ['./portfolios-table.component.scss'],
})
export class PortfoliosTableComponent implements OnInit {
  // TODO: Add type for this
  portfolios = [];
  totalRecords: number;

  moment = moment;

  loading = true;

  displayCreatePortfolioDialog: boolean = false;

  constructor(
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {}

  loadPortfolios(event: LazyLoadEvent) {
    this.loading = true;

    this.portfolioService.getPortfolios(50, event.first, 'num_likes', SortDirection.DESC, '').subscribe(
      (listPortfolioDto: ListPortfoliosDto) => {
        this.portfolios = listPortfolioDto.items;
        this.totalRecords = listPortfolioDto.totalCount;

        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  confirmLogin(event: Event) {
    if (this.authService.isAuthorized()) {
      this.showDialog();
    } else {
      this.confirmationService.confirm({
        target: event.target,
        message: 'You must have an account. Would you like to login?',
        accept: () => {
          this.router.navigate(['/login']);
        },
        reject: () => {
          // this.displayCreatePortfolioDialog = false;
        },
      });
    }
  }

  showDialog() {
    this.displayCreatePortfolioDialog = true;
  }
}

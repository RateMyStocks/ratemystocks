import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserPortfolioDto, UserProfileDto } from '@ratemystocks/api-interface';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { PortfolioService } from '../../../../core/services/portfolio.service';

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

  portfoliosLoaded = false;
  portfolios: UserPortfolioDto[] = [];

  constructor(
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {}

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

      this.portfolios = portfolios;
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  /**
   * Deletes a Portfolio by it's unique id when the delete button in the row is clicked.
   * @param portfolioId The UUID of the portfolio to delete.
   */
  onClickDeletePortfolioButton(portfolioId: string): void {
    if (this.isAuth && this.user.id === this.loggedInUserId) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete your portfolio?',
        accept: () => {
          this.portfolioService.deletePortfolioById(portfolioId).subscribe(() => {
            this.portfolios = this.portfolios.filter(val => val.id !== portfolioId);
          });
        }
      });
    }
  }
}

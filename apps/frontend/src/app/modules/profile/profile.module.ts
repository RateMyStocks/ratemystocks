import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppCodeModule } from '../../app.code.component';
import { PrimeNGModule } from '../../primeng.module';
import { SharedModule } from '../../shared/shared.module';
import { AccountInfoSettingsComponent } from './components/account-info-settings/account-info-settings.component';
import { AccountSecuritySettingsComponent } from './components/account-security-settings/account-security-settings.component';
import { SavedPortfoliosTableComponent } from './components/saved-portfolios-table/saved-portfolios-table.component';
import { SavedStocksTableComponent } from './components/saved-stocks-table/saved-stocks-table.component';
import { UserStockRatingsTableComponent } from './components/user-stock-ratings-table/user-stock-ratings-table.component';

@NgModule({
  declarations: [FavoritesComponent, UserProfileComponent, SettingsComponent, AccountInfoSettingsComponent, AccountSecuritySettingsComponent, SavedPortfoliosTableComponent, SavedStocksTableComponent, UserStockRatingsTableComponent],
  imports: [
    AppCodeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNGModule,
    SharedModule,
    ProfileRoutingModule,
  ],
})
export class ProfileModule {}

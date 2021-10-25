import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UserPortfoliosTableComponent } from './components/user-portfolios-table/user-portfolios-table.component';
import { UserProfileHeaderComponent } from './components/user-profile-header/user-profile-header.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { SavedPortfoliosTableComponent } from './components/saved-portfolios-table/saved-portfolios-table.component';
import { UserStockRatingsTableComponent } from './components/user-stock-ratings-table/user-stock-ratings-table.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { AngularMaterialModule } from '../../angular-material.module';

@NgModule({
  declarations: [
    UserProfileComponent,
    SettingsComponent,
    UserPortfoliosTableComponent,
    UserProfileHeaderComponent,
    FavoritesComponent,
    SavedPortfoliosTableComponent,
    UserStockRatingsTableComponent,
  ],
  imports: [AngularMaterialModule, CommonModule, ProfileRoutingModule, RouterModule, SharedModule],
})
export class ProfileModule {}

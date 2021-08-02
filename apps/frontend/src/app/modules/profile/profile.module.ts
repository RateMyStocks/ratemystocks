import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { SettingsComponent } from './pages/settings/settings.component';
import { UserPortfoliosTableComponent } from './components/user-portfolios-table/user-portfolios-table.component';
import { UserProfileHeaderComponent } from './components/user-profile-header/user-profile-header.component';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { SavedPortfoliosTableComponent } from './components/saved-portfolios-table/saved-portfolios-table.component';

@NgModule({
  declarations: [
    UserProfileComponent,
    SettingsComponent,
    UserPortfoliosTableComponent,
    UserProfileHeaderComponent,
    FavoritesComponent,
    SavedPortfoliosTableComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    RouterModule,
    SharedModule,
  ],
})
export class ProfileModule {}

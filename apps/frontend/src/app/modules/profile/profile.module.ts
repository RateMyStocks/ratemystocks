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

@NgModule({
  declarations: [FavoritesComponent, UserProfileComponent, SettingsComponent],
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

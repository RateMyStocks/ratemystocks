import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

export const PROFILE_ROUTES = [
  { path: 'users/:username', component: UserProfileComponent },
  { path: 'settings', canActivate: [AuthGuard], component: SettingsComponent },
  { path: 'favorites', canActivate: [AuthGuard], component: FavoritesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(PROFILE_ROUTES)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}

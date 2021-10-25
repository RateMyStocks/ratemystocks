import { FavoritesComponent } from './pages/favorites/favorites.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

export const PROFILE_ROUTES = [
  { path: 'users/:username', component: UserProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'favorites', component: FavoritesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(PROFILE_ROUTES)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}

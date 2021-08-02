import { FavoritesComponent } from './pages/favorites/favorites.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

export const PROFILE_ROUTES = [
  { path: 'users/:username', component: UserProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'favorites', component: FavoritesComponent },
];

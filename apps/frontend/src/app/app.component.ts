import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './core/services/auth.service';
import { LocalStorageService } from './core/services/local-storage.service';
import { WindowService } from './core/services/window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // TODO: Pass these settings as inputs to child components (topbar, menu, footer, & main)
  topbarTheme = 'light';

  menuTheme = 'dim';

  layoutMode = 'light';

  menuMode = 'static';

  // TODO: Remove
  isRTL = false;

  inputStyle = 'outlined';

  // TODO: Remove
  ripple = false;

  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private windowService: WindowService,
    @Inject(PLATFORM_ID) private platformId: any,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.authService.setUpAuthStatus();

    // If the token stored in local storage expires, ensure the user is logged-out in al ltabs
    if (isPlatformBrowser(this.platformId)) {
      this.windowService.nativeWindow.addEventListener('storage', (event) => {
        if (event.storageArea == localStorage) {
          const token = this.localStorageService.getItem('token');
          if (!token) {
            this.windowService.nativeWindow.location.reload(); // Hard Refresh page to ensure they are logged-out properly in other tabs
          }
        }
      });
    }
  }
}

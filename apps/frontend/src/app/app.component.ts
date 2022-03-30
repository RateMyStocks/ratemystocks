import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './core/services/auth.service';
import { LocalStorageService } from './core/services/local-storage.service';
import { WindowService } from './core/services/window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
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
    private renderer: Renderer2,
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

  ngAfterViewInit(): void {
    // For the page loader animation to show with Angular universal, it must be outside of app-root
    // and then hidden once the application has loaded in the browser.
    if (isPlatformBrowser(this.platformId)) {
      const loader = this.renderer.selectRootElement('.loader');

      if (loader.style.display != "none") {
        loader.style.display = "none";
      }
    }
  }
}

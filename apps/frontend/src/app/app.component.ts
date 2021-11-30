import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

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
  ripple: boolean;

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}

// import { Component, PLATFORM_ID, OnInit, Inject } from '@angular/core';
// import { AuthService } from './core/services/auth.service';
// import { LocalStorageService } from './core/services/local-storage.service';
// import { WindowService } from './core/services/window.service';
// import { isPlatformBrowser } from '@angular/common';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss'],
// })
// export class AppComponent implements OnInit {
//   title = 'ratemystocks';

//   constructor(
//     private authService: AuthService,
//     private windowService: WindowService,
//     @Inject(PLATFORM_ID) private platformId: any,
//     private localStorageService: LocalStorageService
//   ) {}

//   ngOnInit(): void {
//     this.authService.setUpAuthStatus();

//     if (isPlatformBrowser(this.platformId)) {
//       this.windowService.nativeWindow.addEventListener('storage', (event) => {
//         if (event.storageArea == localStorage) {
//           const token = this.localStorageService.getItem('token');
//           if (!token) {
//             this.windowService.nativeWindow.location.reload(); // Hard Refresh page to ensure they are logged-out properly in other tabs
//           }
//         }
//       });
//     }
//   }
// }

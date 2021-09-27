import { Component, PLATFORM_ID, OnInit, Inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { LocalStorageService } from './core/services/local-storage.service';
import { WindowService } from './core/services/window.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ratemystocks';

  isProduction: boolean = environment.production;

  constructor(
    private authService: AuthService,
    private windowService: WindowService,
    @Inject(PLATFORM_ID) private platformId: any,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.authService.setUpAuthStatus();

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

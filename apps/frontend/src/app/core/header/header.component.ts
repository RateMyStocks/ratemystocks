import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { SidenavService } from '../sidenav/sidenav.service';
@Component({
  selector: 'ratemystocks-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userName: string;
  isAuth$: Subscription;
  isAuth: boolean;

  /**
   * Injects the SidenavService, allowing us to toggle the side navbar.
   * @param sidenav The SidenavService
   */
  constructor(
    private sidenav: SidenavService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnDestroy(): void {
    this.isAuth$.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.getLoggedInName.subscribe((name: string) => (this.userName = name));
    this.isAuth = this.authService.isAuthorized();
    const loggedInUsername = this.localStorageService.getItem('loggedInUsername');
    this.isAuth$ = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuth = authStatus;
    });
    if (loggedInUsername) {
      this.userName = loggedInUsername;
    }
  }

  /** Opens & closes the sidebar.component (#sidenav) using the injected SidenavService */
  toggleSideBar(): void {
    this.sidenav.toggle();
  }

  closeSideNav(): void {
    this.sidenav.close();
  }

  logOut(): void {
    this.authService.logOut();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpiritAnimal } from '@ratemystocks/api-interface';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { SidenavService } from '../sidenav/sidenav.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userName: string;
  avatar: string;
  authStatusSub: Subscription;
  isAuth: boolean;

  /**
   * Injects the SidenavService, allowing us to toggle the side navbar.
   * @param sidenav The SidenavService used to toggle the sidebar component.
   * @param authService The AuthService used for determining the authentication status of the user.
   */
  constructor(private sidenav: SidenavService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuth = this.authService.isAuthorized();
    this.userName = this.authService.getUsername();
    this.avatar = this.authService.getSpiritAnimal();

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuth = authStatus;
      if (this.isAuth) {
        this.userName = this.authService.getUsername();
        this.avatar = this.authService.getSpiritAnimal();
      }
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
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

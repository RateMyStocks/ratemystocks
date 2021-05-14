import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from './sidenav.service';
import { Router, NavigationStart } from '@angular/router';
import { WindowService } from '../services/window.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements AfterViewInit, OnInit, OnDestroy {
  /** Finds the mat-sidenav within the HTML template containing the #sidenav template reference variable */
  @ViewChild('sidenav') public sidenav: MatSidenav;

  currentRoute: string;

  private resizeSubscription: Subscription;

  /**
   * Injects the SidenavService, allowing us to toggle the side navbar.
   * @param sidenav The SidenavService
   */
  constructor(private router: Router, private sidenavService: SidenavService, private windowService: WindowService) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.router.events.subscribe((event: NavigationStart) => {
      this.currentRoute = this.router.url;
    });
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);

    // TODO: With Angular Universal, this is logging "ERROR ReferenceError: window is not defined", though it still seems to work
    if (window.innerWidth < 600) {
      this.sidenav.close();
    }

    this.resizeSubscription = this.windowService.onResize$.subscribe((eventTarget: any) => {
      if (eventTarget.innerWidth < 600) {
        this.sidenav.close();
      }
    });
  }

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
}

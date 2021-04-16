import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from './sidenav.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements AfterViewInit, OnInit {
  /** Finds the mat-sidenav within the HTML template containing the #sidenav template reference variable */
  @ViewChild('sidenav') public sidenav: MatSidenav;
  currentRoute: string;
  /**
   * Injects the SidenavService, allowing us to toggle the side navbar.
   * @param sidenav The SidenavService
   */
  // TODO: UNCOMMENT THIS
  // constructor(private sidenavService: SidenavService, private router: Router) {}
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.router.events.subscribe((event: NavigationStart) => {
      this.currentRoute = this.router.url;
    });
  }

  ngAfterViewInit(): void {
    // this.sidenavService.setSidenav(this.sidenav);

    if (window.innerWidth < 600) {
      this.sidenav.close();
    }
  }

  /**
   * Closes the side navbar when the brower is resized to less than 600 pixels, otherwises opens it.
   * @param event The emitted resize event
   */
  onResize(event: any): void {
    if (event.target.innerWidth < 600) {
      this.sidenav.close();
    }
  }
}

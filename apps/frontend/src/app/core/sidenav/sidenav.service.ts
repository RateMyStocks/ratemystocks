import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDrawerToggleResult } from '@angular/material/sidenav';

/** Service that handles the toggling (opening & closing) of the sidebar.component (#sidenav). */
@Injectable()
export class SidenavService {
  private sidenav: MatSidenav;

  /**
   * Initializes the sidenav field with a mat-sidenav component.
   * @param sidenav The mat-sidenav to assign.
   */
  public setSidenav(sidenav: MatSidenav): void {
    this.sidenav = sidenav;
  }

  /** Displays the mat-sidenav */
  public open(): Promise<MatDrawerToggleResult> {
    return this.sidenav.open();
  }

  /** Collapses the mat-sidenav */
  public close(): Promise<MatDrawerToggleResult> {
    return this.sidenav.close();
  }

  /** Toggles the mat-sidenav (opens if closed, closes if opened) */
  public toggle(): void {
    this.sidenav.toggle();
  }
}

import { EventManager } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * Since Angular AUniversal renders the app server-side, browser-only global objects like window cannot be referenced.
 * Therefore, this service is an abstraction of the window object that can be injected into components that need to use it.
 */
@Injectable({
  providedIn: 'root',
})
export class WindowService {
  get onResize$(): Observable<Window> {
    return this.resizeSubject.asObservable();
  }

  private resizeSubject: Subject<Window>;

  constructor(private eventManager: EventManager) {
    this.resizeSubject = new Subject();
    this.eventManager.addGlobalEventListener('window', 'resize', this.onResize.bind(this));
  }

  private onResize(event: UIEvent) {
    this.resizeSubject.next(<Window>event.target);
  }
}

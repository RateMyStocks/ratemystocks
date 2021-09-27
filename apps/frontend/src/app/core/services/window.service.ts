import { EventManager } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

function getWindow(): any {
  return window;
}

/**
 * Since Angular Universal renders the app server-side, browser-only global objects like window cannot be referenced.
 * Therefore, this service is an abstraction of the window object that can be injected into components that need to use it.
 */
@Injectable({
  providedIn: 'root',
})
export class WindowService {
  private resizeSubject: Subject<Window>;

  private innerWidthSubject: Subject<number> = new Subject<number>();

  constructor(private eventManager: EventManager) {
    this.resizeSubject = new Subject();
    this.eventManager.addGlobalEventListener('window', 'resize', this.onResize.bind(this));
    this.eventManager.addGlobalEventListener('window', 'load', this.onOpen.bind(this));
  }

  getInnerWidth(): Observable<number> {
    return this.innerWidthSubject.asObservable();
  }

  get onResize$(): Observable<Window> {
    return this.resizeSubject.asObservable();
  }

  private onResize(event: UIEvent): void {
    this.resizeSubject.next(<Window>event.target);
  }

  private onOpen(event: Event): void {
    const window: Window = <Window>event.currentTarget;
    this.innerWidthSubject.next(window.innerWidth);
  }

  get nativeWindow(): Window {
    return getWindow();
  }
}

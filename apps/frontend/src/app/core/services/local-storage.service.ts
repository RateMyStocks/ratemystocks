import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** This service is needed because Angular Universal will not recognize local storage b/c it is a browser API */
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  clear() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }

  setItem(key: string, value: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  getItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
  }

  removeItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  key(index: number) {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.key(index);
    }
  }

  length() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.length;
    }
  }
}

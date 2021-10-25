import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth.service';
import { SidenavService } from '../sidenav/sidenav.service';
import { CoreModule } from '../core.module';
import { By } from '@angular/platform-browser';
import { SpiritAnimal } from '@ratemystocks/api-interface';
import { Observable, Subject } from 'rxjs';
import { RouterLinkWithHref } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockAuthServiceLoggedOut {
  isAuthorized() {
    return false;
  }

  getUserId(): string {
    return null;
  }

  getUsername(): string {
    return null;
  }

  getSpiritAnimal(): SpiritAnimal {
    return null;
  }

  getAuthStatusListener(): Observable<boolean> {
    return new Subject<boolean>();
  }
}

class MockAuthServiceLoggedIn {
  isAuthorized() {
    return true;
  }

  getUserId(): string {
    return '2498f310-cbc6-4af0-bab6-793e640aede4';
  }

  getUsername(): string {
    return 'bobtheuser';
  }

  getSpiritAnimal(): SpiritAnimal {
    return SpiritAnimal.ANTELOPE;
  }

  getAuthStatusListener(): Observable<boolean> {
    return new Subject<boolean>();
  }
}

describe('HeaderComponent', () => {
  describe('Logged-Out', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    let mockAuthService: MockAuthServiceLoggedOut;

    /**
     * Official Jest workaround for mocking methods that are not implemented in JSDOM
     * {@link https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom}
     * {@link https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function}
     */
    beforeAll(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(), // Deprecated
          removeListener: jest.fn(), // Deprecated
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });

    beforeEach(async(() => {
      mockAuthService = new MockAuthServiceLoggedOut();

      TestBed.configureTestingModule({
        imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule, CoreModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        declarations: [HeaderComponent],
        providers: [
          SidenavService,
          {
            provide: AuthService,
            useValue: mockAuthService,
          },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show the correct layout when the user is not logged-in', () => {
      // Show login & signup buttons
      const loginBtn: DebugElement = fixture.debugElement.query(By.css('#login-btn'));
      const signupBtn: DebugElement = fixture.debugElement.query(By.css('#signup-btn'));
      expect(loginBtn).toBeTruthy();
      expect(signupBtn).toBeTruthy();

      // Do not show profile picture, username, and logout button
      const profilePicture: DebugElement = fixture.debugElement.query(By.css('.profile-picture'));
      const username: DebugElement = fixture.debugElement.query(By.css('#header-username'));
      const logoutBtn: DebugElement = fixture.debugElement.query(By.css('#logout-btn'));
      expect(profilePicture).toBeFalsy();
      expect(username).toBeFalsy();
      expect(logoutBtn).toBeFalsy();
    });

    it('should contain the correct URLs in the routerLinks for the login and signup button', () => {
      const loginLink: DebugElement = fixture.debugElement.query(By.css('#login-btn'));
      const routerLinkInstance = loginLink.injector.get(RouterLinkWithHref);
      expect(routerLinkInstance['commands']).toEqual(['/auth/signin']);
      expect(routerLinkInstance['href']).toEqual('/auth/signin');

      const signupLink: DebugElement = fixture.debugElement.query(By.css('#signup-btn'));
      const routerLinkInstance2 = signupLink.injector.get(RouterLinkWithHref);
      expect(routerLinkInstance2['commands']).toEqual(['/auth/register']);
      expect(routerLinkInstance2['href']).toEqual('/auth/register');
    });
  });

  describe('Logged-In', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    let mockAuthService: MockAuthServiceLoggedIn;

    /**
     * Official Jest workaround for mocking methods that are not implemented in JSDOM
     * {@link https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom}
     * {@link https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function}
     */
    beforeAll(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(), // Deprecated
          removeListener: jest.fn(), // Deprecated
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });

    beforeEach(async(() => {
      mockAuthService = new MockAuthServiceLoggedIn();

      TestBed.configureTestingModule({
        imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule, CoreModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        declarations: [HeaderComponent],
        providers: [
          SidenavService,
          {
            provide: AuthService,
            useValue: mockAuthService,
          },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show the correct layout when the user is logged-in', () => {
      // Do not show login & signup buttons
      const loginBtn: DebugElement = fixture.debugElement.query(By.css('#login-btn'));
      const signupBtn: DebugElement = fixture.debugElement.query(By.css('#signup-btn'));
      expect(loginBtn).toBeFalsy();
      expect(signupBtn).toBeFalsy();

      // Show profile picture
      const profilePicture: DebugElement = fixture.debugElement.query(By.css('.profile-picture'));
      expect(profilePicture).toBeTruthy();

      // TODO: Figure out how to test username and logout button in the matMenu
    });
  });
});

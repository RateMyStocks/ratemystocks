import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SpiritAnimal } from '@ratemystocks/api-interface';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ProfileModule } from '../../profile.module';

import { UserProfileComponent } from './user-profile.component';

class MockAuthService {
  isAuthorized() {
    return true;
  }

  getUserId(): string {
    return '2498f310-cbc6-4af0-bab6-793e640aede4';
  }

  getAuthStatusListener(): Observable<boolean> {
    return new Subject<boolean>();
  }
}

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let mockAuthService: MockAuthService;

  beforeEach(async () => {
    mockAuthService = new MockAuthService();

    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [ProfileModule, BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;

    component.user = {
      id: 'ddb2a4a0-262e-4cd7-8d13-8eae5e4019c8',
      username: 'TestUser',
      email: 'test@gmail.com',
      spiritAnimal: SpiritAnimal.ANTELOPE,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
import { ProfileModule } from '../../profile.module';

import { UserProfileComponent } from './user-profile.component';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [ProfileModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: AppBreadcrumbService,
          useValue: new AppBreadcrumbService(),
        },
        {
          provide: MessageService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (username: string) => 'gabelorenzo' }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

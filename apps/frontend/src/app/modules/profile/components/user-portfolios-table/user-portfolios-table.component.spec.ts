import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserProfileDto, SpiritAnimal } from '@ratemystocks/api-interface';
import { ProfileModule } from '../../profile.module';

import { UserPortfoliosTableComponent } from './user-portfolios-table.component';

describe('UserPortfoliosTableComponent', () => {
  let component: UserPortfoliosTableComponent;
  let fixture: ComponentFixture<UserPortfoliosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPortfoliosTableComponent],
      imports: [ProfileModule, HttpClientTestingModule, RouterTestingModule],
      providers: [MessageService, ConfirmationService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPortfoliosTableComponent);
    component = fixture.componentInstance;

    const user: UserProfileDto = {
      id: '7fba80ff-a837-4d0e-acc0-13ff63cf0e9d',
      username: 'testuser',
      email: 'testuser@email.com',
      spiritAnimal: SpiritAnimal.ANTELOPE,
      dateJoined: new Date(),
      lastLogin: new Date(),
      bio: 'Some Bio',
    };

    component.user = user;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { ProfileModule } from '../../profile.module';
import { UserProfileDto, SpiritAnimal } from '@ratemystocks/api-interface';

import { UserStockRatingsTableComponent } from './user-stock-ratings-table.component';

describe('UserStockRatingsTableComponent', () => {
  let component: UserStockRatingsTableComponent;
  let fixture: ComponentFixture<UserStockRatingsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserStockRatingsTableComponent],
      imports: [ProfileModule, HttpClientTestingModule],
      providers: [MessageService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStockRatingsTableComponent);
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

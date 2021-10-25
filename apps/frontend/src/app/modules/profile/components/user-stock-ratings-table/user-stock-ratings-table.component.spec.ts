import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserStockRatingsTableComponent } from './user-stock-ratings-table.component';
import { ProfileModule } from '../../profile.module';
import { SpiritAnimal } from '@ratemystocks/api-interface';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UserStockRatingsTableComponent', () => {
  let component: UserStockRatingsTableComponent;
  let fixture: ComponentFixture<UserStockRatingsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserStockRatingsTableComponent],
      imports: [ProfileModule, BrowserAnimationsModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStockRatingsTableComponent);
    component = fixture.componentInstance;

    component.user = {
      id: '40da5407-794e-4493-bb5c-127953303e5f',
      username: 'testuser',
      email: 'test@email.com',
      spiritAnimal: SpiritAnimal.ANTELOPE,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

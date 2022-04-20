import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStockRatingsTableComponent } from './user-stock-ratings-table.component';

describe('UserStockRatingsTableComponent', () => {
  let component: UserStockRatingsTableComponent;
  let fixture: ComponentFixture<UserStockRatingsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserStockRatingsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStockRatingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

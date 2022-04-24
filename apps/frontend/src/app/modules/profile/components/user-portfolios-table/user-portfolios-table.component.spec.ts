import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPortfoliosTableComponent } from './user-portfolios-table.component';

describe('UserPortfoliosTableComponent', () => {
  let component: UserPortfoliosTableComponent;
  let fixture: ComponentFixture<UserPortfoliosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPortfoliosTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPortfoliosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

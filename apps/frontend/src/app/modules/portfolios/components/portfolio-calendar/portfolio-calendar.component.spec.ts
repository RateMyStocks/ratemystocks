import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioCalendarComponent } from './portfolio-calendar.component';

describe('PortfolioCalendarComponent', () => {
  let component: PortfolioCalendarComponent;
  let fixture: ComponentFixture<PortfolioCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

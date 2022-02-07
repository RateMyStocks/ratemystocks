import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioBreakdownPieChartComponent } from './portfolio-breakdown-pie-chart.component';

describe('PortfolioBreakdownPieChartComponent', () => {
  let component: PortfolioBreakdownPieChartComponent;
  let fixture: ComponentFixture<PortfolioBreakdownPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioBreakdownPieChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioBreakdownPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

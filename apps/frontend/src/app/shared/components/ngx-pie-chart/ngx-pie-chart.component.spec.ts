import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxPieChartComponent } from './ngx-pie-chart.component';

describe('NgxPieChartComponent', () => {
  let component: NgxPieChartComponent;
  let fixture: ComponentFixture<NgxPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxPieChartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

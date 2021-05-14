import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';

import { NgxPieChartComponent } from './ngx-pie-chart.component';

describe('NgxPieChartComponent', () => {
  let component: NgxPieChartComponent;
  let fixture: ComponentFixture<NgxPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxPieChartComponent],
      imports: [SharedModule, FormsModule, ReactiveFormsModule],
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

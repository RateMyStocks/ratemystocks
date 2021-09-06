import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksTableComponent } from './stocks-table.component';

describe('StocksTableComponent', () => {
  let component: StocksTableComponent;
  let fixture: ComponentFixture<StocksTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StocksTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

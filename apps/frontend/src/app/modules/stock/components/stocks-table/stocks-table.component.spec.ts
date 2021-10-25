import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StocksTableComponent } from './stocks-table.component';
import { StockModule } from '../../stock.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('StocksTableComponent', () => {
  let component: StocksTableComponent;
  let fixture: ComponentFixture<StocksTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StocksTableComponent],
      imports: [StockModule, BrowserAnimationsModule, HttpClientTestingModule],
    }).compileComponents();
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

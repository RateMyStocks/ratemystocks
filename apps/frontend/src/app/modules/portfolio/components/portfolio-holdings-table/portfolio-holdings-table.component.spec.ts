import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PortfolioModule } from '../../portfolio.module';

import { PortfolioHoldingsTableComponent } from './portfolio-holdings-table.component';

describe('PortfolioHoldingsTableComponent', () => {
  let component: PortfolioHoldingsTableComponent;
  let fixture: ComponentFixture<PortfolioHoldingsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioHoldingsTableComponent],
      imports: [HttpClientTestingModule, PortfolioModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioHoldingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

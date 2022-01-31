import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePortfolioHoldingsDialogComponent } from './update-portfolio-holdings-dialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PortfoliosModule } from '../../portfolios.module';

describe('UpdatePortfolioHoldingsDialogComponent', () => {
  let component: UpdatePortfolioHoldingsDialogComponent;
  let fixture: ComponentFixture<UpdatePortfolioHoldingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatePortfolioHoldingsDialogComponent],
      imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule, PortfoliosModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePortfolioHoldingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

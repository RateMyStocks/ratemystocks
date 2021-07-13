import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePortfolioHoldingsDialogComponent } from './update-portfolio-holdings-dialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PortfolioModule } from '../../portfolio.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

describe('UpdatePortfolioHoldingsDialogComponent', () => {
  let component: UpdatePortfolioHoldingsDialogComponent;
  let fixture: ComponentFixture<UpdatePortfolioHoldingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatePortfolioHoldingsDialogComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, PortfolioModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { portfolioStocks: [] } },
        { provide: MatDialogRef, useValue: {} },
      ],
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

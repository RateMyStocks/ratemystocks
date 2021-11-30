import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PortfolioModule } from '../../portfolio.module';

import { UpdatePortfolioNameDialogComponent } from './update-portfolio-name-dialog.component';

describe('UpdatePortfolioNameDialogComponent', () => {
  let component: UpdatePortfolioNameDialogComponent;
  let fixture: ComponentFixture<UpdatePortfolioNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePortfolioNameDialogComponent],
      imports: [BrowserAnimationsModule, HttpClientTestingModule, PortfolioModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { portfolio: { name: 'Some Portfolio Name' } } },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePortfolioNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should populate the input field with the portfolio name', () => {
    const nameField = fixture.debugElement.query(By.css('mat-form-field input'));
    expect(nameField.nativeElement.value).toEqual('Some Portfolio Name');
  });

  // TODO: mock portfolioService.updatePortfolioName and test button click & onSubmit
});

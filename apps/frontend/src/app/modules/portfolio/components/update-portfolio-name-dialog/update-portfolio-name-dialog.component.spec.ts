import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';

import { UpdatePortfolioNameDialogComponent } from './update-portfolio-name-dialog.component';

describe('UpdatePortfolioNameDialogComponent', () => {
  let component: UpdatePortfolioNameDialogComponent;
  let fixture: ComponentFixture<UpdatePortfolioNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePortfolioNameDialogComponent],
      imports: [HttpClientTestingModule, MatDialogModule, MatSnackBarModule, FormsModule, ReactiveFormsModule],
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

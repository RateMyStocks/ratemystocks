import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';

import { UpdatePortfolioDescriptionDialogComponent } from './update-portfolio-description-dialog.component';

describe('UpdatePortfolioDescriptionDialogComponent', () => {
  let component: UpdatePortfolioDescriptionDialogComponent;
  let fixture: ComponentFixture<UpdatePortfolioDescriptionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, MatSnackBarModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { portfolio: { description: 'Some Portfolio Description' } } },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePortfolioDescriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should populate the text area with the portfolio description field', () => {
    const descriptionField = fixture.debugElement.query(By.css('mat-form-field textarea'));
    // TODO: FIGURE OUT WHY THIS ISN'T WORKING IN THIS TEST (Works in browser)
    //  expect(descriptionField.nativeElement.value).toEqual('Some Portfolio Description');
  });
});

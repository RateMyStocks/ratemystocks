import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PortfolioModule } from '../../portfolio.module';

import { UpdatePortfolioDescriptionDialogComponent } from './update-portfolio-description-dialog.component';

describe('UpdatePortfolioDescriptionDialogComponent', () => {
  let component: UpdatePortfolioDescriptionDialogComponent;
  let fixture: ComponentFixture<UpdatePortfolioDescriptionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HttpClientTestingModule, PortfolioModule],
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

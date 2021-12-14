import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PortfoliosModule } from '../../portfolios.module';

import { UpdatePortfolioNameDialogComponent } from './update-portfolio-name-dialog.component';

describe('UpdatePortfolioNameDialogComponent', () => {
  let component: UpdatePortfolioNameDialogComponent;
  let fixture: ComponentFixture<UpdatePortfolioNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePortfolioNameDialogComponent],
      imports: [BrowserAnimationsModule, HttpClientTestingModule, PortfoliosModule],
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

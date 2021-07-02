import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePortfolioHoldingsDialogComponent } from './update-portfolio-holdings-dialog.component';

describe('UpdatePortfolioHoldingsDialogComponent', () => {
  let component: UpdatePortfolioHoldingsDialogComponent;
  let fixture: ComponentFixture<UpdatePortfolioHoldingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePortfolioHoldingsDialogComponent ]
    })
    .compileComponents();
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

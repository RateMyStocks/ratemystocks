import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedPortfoliosTableComponent } from './saved-portfolios-table.component';

describe('SavedPortfoliosTableComponent', () => {
  let component: SavedPortfoliosTableComponent;
  let fixture: ComponentFixture<SavedPortfoliosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedPortfoliosTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedPortfoliosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

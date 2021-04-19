import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterTestingModule } from '@angular/router/testing';

import { StockSearchComponent } from './stock-search.component';

describe('StockSearchComponent', () => {
  let component: StockSearchComponent;
  let fixture: ComponentFixture<StockSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StockSearchComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, MatAutocompleteModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

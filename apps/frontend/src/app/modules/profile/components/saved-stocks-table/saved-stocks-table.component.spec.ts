import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedStocksTableComponent } from './saved-stocks-table.component';

describe('SavedStocksTableComponent', () => {
  let component: SavedStocksTableComponent;
  let fixture: ComponentFixture<SavedStocksTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedStocksTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedStocksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

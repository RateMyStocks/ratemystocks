import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockPageCommentsComponent } from './stock-page-comments.component';

describe('StockPageCommentsComponent', () => {
  let component: StockPageCommentsComponent;
  let fixture: ComponentFixture<StockPageCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockPageCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockPageCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

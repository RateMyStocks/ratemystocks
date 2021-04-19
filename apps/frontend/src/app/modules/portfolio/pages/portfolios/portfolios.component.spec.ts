import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfoliosComponent } from './portfolios.component';

describe('PortfoliosComponent', () => {
  let component: PortfoliosComponent;
  let fixture: ComponentFixture<PortfoliosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortfoliosComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfoliosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

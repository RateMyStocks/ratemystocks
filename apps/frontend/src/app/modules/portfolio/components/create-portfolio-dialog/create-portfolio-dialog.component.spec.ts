import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { PortfolioModule } from '../../portfolio.module';

import { CreatePortfolioDialogComponent } from './create-portfolio-dialog.component';

describe('CreatePortfolioDialogComponent', () => {
  let component: CreatePortfolioDialogComponent;
  let fixture: ComponentFixture<CreatePortfolioDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePortfolioDialogComponent],
      imports: [BrowserAnimationsModule, HttpClientTestingModule, PortfolioModule, RouterTestingModule],
      providers: [{ provide: MatDialogRef, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePortfolioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

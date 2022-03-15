import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
import { PortfoliosModule } from '../../portfolios.module';

import { PortfolioComponent } from './portfolio.component';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortfolioComponent],
      imports: [PortfoliosModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: AppBreadcrumbService,
          useValue: new AppBreadcrumbService(),
        },
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

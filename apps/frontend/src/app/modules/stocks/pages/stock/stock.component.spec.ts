import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
import { StocksModule } from '../../stocks.module';

import { StockComponent } from './stock.component';

describe('StockComponent', () => {
  let component: StockComponent;
  let fixture: ComponentFixture<StockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockComponent],
      imports: [StocksModule, RouterTestingModule],
      providers: [
        {
          provide: AppBreadcrumbService,
          useValue: new AppBreadcrumbService(),
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (ticker: string) => 'MSFT' }),
          },
        },
        {
          provide: MessageService,
        },
        {
          provide: ConfirmationService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

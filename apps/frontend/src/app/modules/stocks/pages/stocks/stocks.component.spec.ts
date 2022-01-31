import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
import { StocksModule } from '../../stocks.module';

import { StocksComponent } from './stocks.component';

describe('StocksComponent', () => {
  let component: StocksComponent;
  let fixture: ComponentFixture<StocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StocksComponent],
      imports: [StocksModule],
      providers: [
        {
          provide: AppBreadcrumbService,
          useValue: new AppBreadcrumbService(),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

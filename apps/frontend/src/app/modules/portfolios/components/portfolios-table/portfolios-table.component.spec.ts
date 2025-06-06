import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListPortfoliosDto, SpiritAnimal } from '@ratemystocks/api-interface';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { Observable, of } from 'rxjs';
import { PortfoliosTableComponent } from './portfolios-table.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PortfoliosModule } from '../../portfolios.module';
import { ConfirmationService, MessageService } from 'primeng/api';

Date.now = jest.fn(() => new Date(Date.UTC(2021, 5, 28)).valueOf()); // 6/28/2021

class MockPortfolioService {
  getPortfolios(
    pageSize?: number,
    skip?: number,
    orderBy?: string,
    sortDirection?: 'ASC' | 'DESC',
    filter?: string
  ): Observable<ListPortfoliosDto> {
    const portfolio: ListPortfoliosDto = {
      totalCount: 1,
      items: [
        {
          id: '96fc1340-a8ef-4cc9-9b59-6e86cfd352da',
          name: 'Get Rich or Die Trying Portfolio',
          largest_holding: 'MSFT',
          username: '50cent',
          num_likes: 32,
          num_dislikes: 2,
          last_updated: '2021-01-09T06:49:31.108Z',
          num_holdings: 15,
          spirit_animal: SpiritAnimal.ANTELOPE,
        },
      ],
    };
    return of(portfolio);
  }
}

describe('PortfoliosTableComponent', () => {
  let component: PortfoliosTableComponent;
  let fixture: ComponentFixture<PortfoliosTableComponent>;

  // const applyFilterForDropdownsSpy = spyOn(component, 'applyFilterForDropdowns').and.callThrough();
  // const filterPredicateSpy = spyOn(component, 'customFilterPredicate').and.callThrough();
  // const matSort = jasmine.createSpyObj('MatSort', ['sortChange']);
  // const matPaginator = jasmine.createSpyObj('MatPaginator', ['page']);
  // const matSort = {};
  // matSort['sortChange'] = jest.fn();

  // const matPaginator = {};
  // matPaginator['page'] = jest.fn();

  let mockPortfolioService: MockPortfolioService;

  beforeEach(async(() => {
    mockPortfolioService = new MockPortfolioService();

    TestBed.configureTestingModule({
      declarations: [PortfoliosTableComponent],
      imports: [HttpClientTestingModule, PortfoliosModule, RouterTestingModule, BrowserAnimationsModule],
      providers: [
        {
          provide: PortfolioService,
          useValue: mockPortfolioService,
        },
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfoliosTableComponent);
    component = fixture.componentInstance;
    // component.sort = matSort;
    // component.paginator = matPaginator;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should populate the table with data from the portfolio stocks & sorted by name by default', async(() => {
  //   component.ngAfterViewInit();
  //   fixture.detectChanges();

  //   fixture.whenStable().then(() => {
  //     fixture.detectChanges();
  //     const tableRows: DebugElement[] = fixture.debugElement.queryAll(By.css('.mat-row'));
  //     expect(tableRows.length).toEqual(1);

  //     // Row 1
  //     expect(tableRows[0].query(By.css('.mat-column-name')).nativeElement.textContent).toEqual(
  //       'Get Rich or Die Trying Portfolio'
  //     );
  //     expect(tableRows[0].query(By.css('.mat-column-username')).nativeElement.textContent).toEqual('50cent');
  //     expect(tableRows[0].query(By.css('.mat-column-largest_holding')).nativeElement.textContent).toEqual('MSFT');
  //     expect(tableRows[0].query(By.css('.mat-column-num_likes')).nativeElement.textContent).toEqual('32');
  //     expect(tableRows[0].query(By.css('.mat-column-num_dislikes')).nativeElement.textContent).toEqual('2');
  //     expect(tableRows[0].query(By.css('.mat-column-num_holdings')).nativeElement.textContent).toEqual('15');
  //     expect(tableRows[0].query(By.css('.mat-column-last_updated')).nativeElement.textContent).toEqual('6 months ago');
  //   });
  // }));
});

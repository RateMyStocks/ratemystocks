import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SortDirection } from '../../../../shared/models/enums/sort-direction';
import * as moment from 'moment';
import { fromEvent, merge, of as observableOf } from 'rxjs';
import { catchError, debounceTime, delay, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { ListPortfoliosDto } from '@ratemystocks/api-interface';
import { PortfolioService } from 'apps/frontend/src/app/core/services/portfolio.service';

/**
 * Displays all portfolios in the system in a single paginated/sortable table.
 * Use an Angular Material HTTP table and re-fetches data on table events (sorting, paging, filtering, etc.)
 */
@Component({
  selector: 'app-portfolios-table',
  templateUrl: './portfolios-table.component.html',
  styleUrls: ['./portfolios-table.component.scss'],
})
export class PortfoliosTableComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'username',
    'num_likes',
    'num_dislikes',
    'num_holdings',
    'largest_holding',
    'last_updated',
  ];
  data: ListPortfoliosDto = null;

  moment = moment;

  resultsLength = 0;
  isLoadingResults = true;
  errorOccurred = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private portfolioService: PortfolioService) {}

  ngAfterViewInit() {
    // Server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;

          this.updateTable();
        })
      )
      .subscribe();

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.updateTable();
  }

  /** Makes a server-side request to sort, paginate, and filter the portfolios and update the table */
  updateTable() {
    // On sort or paginate events, load a new page
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        delay(0),
        switchMap(() => {
          const matSortDirection: SortDirection = this.sort.direction.toUpperCase() as SortDirection;

          this.isLoadingResults = true;

          return this.portfolioService.getPortfolios(
            this.paginator.pageSize,
            this.paginator.pageIndex * this.paginator.pageSize,
            this.sort.active,
            matSortDirection,
            this.input.nativeElement.value
          );
        }),
        map((data: ListPortfoliosDto) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.errorOccurred = false;
          this.resultsLength = data.totalCount;

          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the API has reached its rate limit. Return empty data.
          this.errorOccurred = true;
          return observableOf([]);
        })
      )
      .subscribe((data: any) => (this.data = data));
  }
}

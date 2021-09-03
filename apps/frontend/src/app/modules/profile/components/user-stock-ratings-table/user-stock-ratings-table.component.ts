import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { StockService } from '../../../../core/services/stock.service';
import { UserProfileDto } from '@ratemystocks/api-interface';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-stock-ratings-table',
  templateUrl: './user-stock-ratings-table.component.html',
  styleUrls: ['./user-stock-ratings-table.component.scss'],
})
export class UserStockRatingsTableComponent implements OnInit {
  moment = moment;
  displayedColumns: string[] = ['logo', 'ticker', 'rating', 'lastUpdated'];
  dataSource: MatTableDataSource<any>;

  @Input() user: UserProfileDto;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.stockService.getStockRatingsForUser(this.user.id, false).subscribe((stockRatings: any[]) => {
      this.dataSource = new MatTableDataSource(stockRatings);

      this.dataSource.sort = this.sort;
    });
  }
}

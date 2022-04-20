import { Component, Input, OnInit } from '@angular/core';
import { UserProfileDto } from '@ratemystocks/api-interface';
import { StockService } from '../../../../core/services/stock.service';

@Component({
  selector: 'app-user-stock-ratings-table',
  templateUrl: './user-stock-ratings-table.component.html',
  styleUrls: ['./user-stock-ratings-table.component.scss'],
})
export class UserStockRatingsTableComponent implements OnInit {
  @Input() user: UserProfileDto;

  ratingTypes = [
    { label: 'BUY', value: 'buy' },
    { label: 'HOLD', value: 'hold' },
    { label: 'SELL', value: 'sell' },
  ];

  stockRatings = [];
  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.stockService.getStockRatingsForUser(this.user.id, false).subscribe((stockRatings: any[]) => {
      this.stockRatings = stockRatings;
    });
  }
}

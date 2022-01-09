import { Component, OnInit } from '@angular/core';
import { StockService } from './core/services/stock.service';

@Component({
  selector: 'app-stock-news-bar',
  templateUrl: './app.stocknewsbar.component.html',
  styleUrls: ['./app.stocknewsbar.component.scss'],
})
export class AppStockNewsBarComponent implements OnInit {
  trendingStocks!: any[];

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.stockService.getMostViewedStocksToday().subscribe((stocks: any[]) => {
      this.trendingStocks = stocks;
    });
  }
}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stock-news-feed',
  templateUrl: './stock-news-feed.component.html',
  styleUrls: ['./stock-news-feed.component.scss'],
})
export class StockNewsFeedComponent {
  @Input()
  stock: any;
}

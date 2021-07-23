import { Component, OnInit, Input } from '@angular/core';
import { MoneyFormatter } from '../../../../shared/utilities/money-formatter';

@Component({
  selector: 'app-stock-key-stats',
  templateUrl: './stock-key-stats.component.html',
  styleUrls: ['./stock-key-stats.component.scss'],
})
export class StockKeyStatsComponent {
  MoneyFormatter = MoneyFormatter;
  @Input()
  stock: any;
}

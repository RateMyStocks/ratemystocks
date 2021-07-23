import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stock-company-info',
  templateUrl: './stock-company-info.component.html',
  styleUrls: ['./stock-company-info.component.scss'],
})
export class StockCompanyInfoComponent {
  @Input()
  stock;
}

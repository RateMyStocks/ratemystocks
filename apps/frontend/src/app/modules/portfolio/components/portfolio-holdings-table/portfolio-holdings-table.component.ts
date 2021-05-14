import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { StockSearchService } from '../../../../core/services/stock-search.service';
import { IexCloudSearchDto } from '@ratemystocks/api-interface';

export interface PortfolioStock {
  ticker: string;
  weighting: number;
}

@Component({
  selector: 'app-portfolio-holdings-table',
  templateUrl: './portfolio-holdings-table.component.html',
  styleUrls: ['./portfolio-holdings-table.component.scss'],
})
export class PortfolioHoldingsTableComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<PortfolioStock>;

  displayedColumns = ['ticker', 'weighting', 'remove'];

  portfolioStocks: PortfolioStock[] = [];

  stockSearchSubscription: Subscription;

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private stockSearchService: StockSearchService) {}

  /** Gets the total cost of all transactions. */
  getTotalWeighting(): number {
    // TODO: The math is weird when you have .01 or something
    const total = this.dataSource.data.reduce((sum: number, v: PortfolioStock) => (sum += Number(v.weighting)), 0);
    return total;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.portfolioStocks);

    this.stockSearchSubscription = this.stockSearchService
      .getSelectedStock()
      .subscribe((stockToAdd: IexCloudSearchDto) => {
        if (stockToAdd) {
          // Prevent adding duplicate stocks to portfolio
          const stockAlreadyAdded: boolean = this.dataSource.data
            .map((stock: PortfolioStock) => stock.ticker)
            .includes(stockToAdd.symbol.toUpperCase());

          if (!stockAlreadyAdded) {
            this.dataSource.data.unshift({
              ticker: stockToAdd.symbol.toUpperCase(),
              weighting: 0,
            });
            this.table.renderRows();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.stockSearchSubscription.unsubscribe();
  }

  /**
   * Deletes a stock from the portfolio and removes the row from the table.
   * @param stock The PortfolioStock in the table to delete.
   */
  remove(stock: PortfolioStock) {
    this.dataSource.data.splice(this.dataSource.data.indexOf(stock), 1);
    this.table.renderRows();
  }

  getHoldings(): PortfolioStock[] {
    return this.dataSource.data;
  }
}

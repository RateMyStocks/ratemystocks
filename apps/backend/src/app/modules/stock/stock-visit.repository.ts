import { StockVisit } from '../../../models/stockVisit.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(StockVisit)
export class StockVisitRepository extends Repository<StockVisit> {
  /**
   * Adds a visit to the stock_visit table indicating a page visit on a given stock page.
   * @param ticker The ticker symbol of the stock page being visited.
   * @param userId (Optional) If a logged-in user visits the stock page, this query parameter will be supplied.
   * @returns The number of page visits for a given stock ticker symbol.
   */
  async addStockPageVisit(ticker: string, userId?: string): Promise<number> {
    const newStockVisit: StockVisit = this.create();
    newStockVisit.userId = userId;
    newStockVisit.ticker = ticker;

    await newStockVisit.save();

    const whereCondition = userId ? { ticker, userId } : { ticker };
    return this.count({ where: whereCondition });
  }
}

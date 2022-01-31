import { StockVisit } from '../../../models/stockVisit.entity';
import { Repository, EntityRepository, getManager } from 'typeorm';

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

    return this.count({ where: { ticker } });
  }

  /**
   * Returns a list of the stock page visit counts for the last N days (defaults to 6).
   * @param ticker The ticker symbol of the stock to get the visit count sfor.
   * @param lastNDays Query param indicating the number of days from the current day to get visit counts for.
   * @returns A list of the stock page visit counts for the last N days.
   */
  async getVisitCounts(ticker: string, lastNDays: number): Promise<any[]> {
    const entityManager = getManager();
    const stockVisits = await entityManager.query(
      `
      SELECT dt.series AS day, COUNT(sv.visit_date) AS visit_count
      FROM stock_visit sv
      RIGHT OUTER JOIN (
          SELECT
          GENERATE_SERIES( (NOW() - INTERVAL '5 day')::date, NOW()::date, '1 day')::date
          AS series
      ) AS dt
      ON DATE_TRUNC('day', sv.visit_date) = dt.series AND ticker = $1
      GROUP BY dt.series
      ORDER BY dt.series ASC
      `,
      [ticker]
    );

    stockVisits.map((sv) => {
      sv.visit_count = parseInt(sv.visit_count);
    });

    return stockVisits;
  }

  /**
   * Gets the most viewed stock tickers today.
   * @param numStocks The limit of stocks to get e.g. top 20 most viewed, top 10, etc.
   * @returns The most viewed stocks in the system in descending order.
   */
  async getMostViewedStocksToday(numStocks = 20): Promise<any[]> {
    const results: any[] = await this.createQueryBuilder('stock_visit')
      .select('ticker, COUNT(visit_date) as num_visits')
      .where(`DATE_TRUNC('day', visit_date) = CURRENT_DATE`)
      .groupBy('ticker')
      .orderBy('num_visits', 'DESC')
      .limit(20)
      .getRawMany();

    return results;
  }
}

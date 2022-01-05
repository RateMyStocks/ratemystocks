import { StockVisit } from '../../../models/stockVisit.entity';
import { Repository, EntityRepository, MoreThan, getManager } from 'typeorm';

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
    // TODO: Make this actually use the lastNDays in the SQL query with proper sanitzation
    // const stockRatings: any[] = await this.createQueryBuilder('sr')
    //   .select(
    //     `
    //       DATE_TRUNC('day', "visit_date") AS day,
    //       COUNT("visit_date") AS visit_count
    //     `
    //   )
    //   .where(`visit_date > current_date - interval '6' day AND ticker = :ticker`, { ticker })
    //   .groupBy(`DATE_TRUNC('day', "visit_date")`)
    //   .orderBy(`DATE_TRUNC('day', "visit_date")`)
    //   .getRawMany();
    const entityManager = getManager();
    const stockVisits: any[] = await entityManager.query(
      `
      SELECT dt.series, COUNT(sv.visit_date) AS visit_count
      FROM stock_visit sv
      RIGHT OUTER JOIN (
          SELECT
          GENERATE_SERIES( (NOW() - INTERVAL '6 day')::date, NOW()::date, '1 day')::date
          AS series
      ) AS dt
      ON DATE_TRUNC('day', sv.visit_date) = dt.series AND ticker = $1
      GROUP BY dt.series
      ORDER BY dt.series ASC
      `,
      [ticker]
    );

    return stockVisits;
  }
}

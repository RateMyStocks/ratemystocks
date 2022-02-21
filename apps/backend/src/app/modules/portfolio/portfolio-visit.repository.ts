import { PortfolioVisit } from '../../../models/portfolioVisit.entity';
import { Repository, EntityRepository, getManager } from 'typeorm';

@EntityRepository(PortfolioVisit)
export class PortfolioVisitRepository extends Repository<PortfolioVisit> {
  /**
   * Adds a visit to the portfolio_visit table indicating a page visit for some portfolio.
   * @param portfolioId The portfolioId of the portfolio being visited.
   * @param userId (Optional) If a logged-in user visits the portfolio page, this query parameter will be supplied.
   * @returns The number of page visits for a given portfolio
   */
  async addPortfolioPageVisit(portfolioId: string, userId?: string): Promise<number> {
    const newPortfolioVisit: PortfolioVisit = this.create();
    newPortfolioVisit.userId = userId;
    newPortfolioVisit.portfolioId = portfolioId;

    await newPortfolioVisit.save();

    return this.count({ where: { portfolioId } });
  }

  /**
   * Returns a list of the portfolio page visit counts for the last N days (defaults to 6).
   * @param portfolioId The id of the portfolio to get the visit count sfor.
   * @param lastNDays Query param indicating the number of days from the current day to get visit counts for.
   * @returns A list of the portfolio page visit counts for the last N days.
   */
  async getVisitCounts(portfolioId: string, lastNDays: number): Promise<any[]> {
    const entityManager = getManager();
    const portfolioVisits = await entityManager.query(
      `
      SELECT dt.series AS day, COUNT(pv.visit_date) AS visit_count
      FROM portfolio_visit pv
      RIGHT OUTER JOIN (
          SELECT
          GENERATE_SERIES( (NOW() - INTERVAL '5 day')::date, NOW()::date, '1 day')::date
          AS series
      ) AS dt
      ON DATE_TRUNC('day', pv.visit_date) = dt.series AND portfolio_id = $1
      GROUP BY dt.series
      ORDER BY dt.series ASC
      `,
      [portfolioId]
    );

    portfolioVisits.map((pv) => {
      pv.visit_count = parseInt(pv.visit_count);
    });

    return portfolioVisits;
  }
}

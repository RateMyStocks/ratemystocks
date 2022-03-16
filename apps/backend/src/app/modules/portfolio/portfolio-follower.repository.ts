import { Repository, EntityRepository, getManager } from 'typeorm';
import { UserAccount } from '../../../models/userAccount.entity';
import { PortfolioFollower } from '../../../models/portfolioFollower.entity';

@EntityRepository(PortfolioFollower)
export class PortfolioFollowerRepository extends Repository<PortfolioFollower> {
  /**
   * Creating an entry in the portfolio_follower table, thus tying a logged-in user to a given ticker symbol so they
   * can be notified of updates and news events later on.
   * @param userAccount The logged-in user following the portfolio.
   * @param portfolioId The id of the portfolio being followed.
   * @returns The number of page visits for a given portfolio.
   */
  async followPortfolio(userAccount: UserAccount, portfolioId: string): Promise<void> {
    const newPortfolioFollower: PortfolioFollower = this.create();
    newPortfolioFollower.userAccount = userAccount;
    newPortfolioFollower.portfolioId = portfolioId;

    await newPortfolioFollower.save();
  }

  /**
   * Gets the number of followers by day for a given portfolio over a given time period.
   * @param portfolioId The id of the portfolio to get the number of followers for.
   * @param lastNDays Optional query parameter indicating the past number of days to get counts for.
   * @return The number of followers by day for a given portfolio over a given time period.
   */
  async getFollowerCountsLastNDays(portfolioId: string, lastNDays: number): Promise<any> {
    const entityManager = getManager();
    const portfolioFollowers = await entityManager.query(
      `
      SELECT dt.series AS day, COUNT(pf.date_followed) AS follower_count
      FROM portfolio_follower pf
      RIGHT OUTER JOIN (
          SELECT
          GENERATE_SERIES( (NOW() - INTERVAL '5 day')::date, NOW()::date, '1 day')::date
          AS series
      ) AS dt
      ON DATE_TRUNC('day', pf.date_followed) = dt.series AND portfolio_id = $1
      GROUP BY dt.series
      ORDER BY dt.series ASC
      `,
      [portfolioId]
    );

    portfolioFollowers.map((pf) => {
      pf.follower_count = parseInt(pf.follower_count);
    });

    return portfolioFollowers;
  }

  /**
   * Gets the portfolios a user is following.
   * @param userAccount The userAccount object of the logged-in user.
   * @returns The list of portfolios the logged-in user is following.
   */
  async getFollowedPortfoliosByUser(userAccount: UserAccount): Promise<any[]> {
    return await this.find({ where: { userId: userAccount.id } });
  }
}

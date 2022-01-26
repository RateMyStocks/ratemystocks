import { StockFollower } from '../../../models/stockFollower.entity';
import { Repository, EntityRepository, getManager } from 'typeorm';
import { UserAccount } from '../../../models/userAccount.entity';

@EntityRepository(StockFollower)
export class StockFollowerRepository extends Repository<StockFollower> {
  /**
   * Creating an entry in the stock_follower table, thus tying a logged-in user to a given ticker symbol so they
   * can be notified of updates and news events later on.
   * @param userAccount The logged-in user following the stock.
   * @param ticker The ticker symbol of the stock page being followed.
   * @returns The number of page visits for a given stock ticker symbol.
   */
  async followStock(userAccount: UserAccount, ticker: string): Promise<void> {
    const newStockFollower: StockFollower = this.create();
    newStockFollower.userAccount = userAccount;
    newStockFollower.ticker = ticker;

    await newStockFollower.save();
  }

  /**
   * Gets the number of followers by day for a given stock over a given time period.
   * @param ticker The ticker symbol of the stock to get the number of followers for.
   * @param lastNDays Optional query parameter indicating the past number of days to get counts for.
   * @return The number of followers by day for a given stock over a given time period.
   */
  async getFollowerCountsLastNDays(ticker: string, lastNDays: number): Promise<any> {
    const entityManager = getManager();
    const stockFollowers = await entityManager.query(
      `
      SELECT dt.series AS day, COUNT(sf.date_followed) AS follower_count
      FROM stock_follower sf
      RIGHT OUTER JOIN (
          SELECT
          GENERATE_SERIES( (NOW() - INTERVAL '5 day')::date, NOW()::date, '1 day')::date
          AS series
      ) AS dt
      ON DATE_TRUNC('day', sf.date_followed) = dt.series AND ticker = $1
      GROUP BY dt.series
      ORDER BY dt.series ASC
      `,
      [ticker]
    );

    stockFollowers.map((sf) => {
      sf.follower_count = parseInt(sf.follower_count);
    });

    return stockFollowers;
  }

  /**
   * Gets the stocks a user is following.
   * @param userAccount The userAccount object of the logged-in user.
   * @returns The list of stocks the logged-in user is following.
   */
  async getFollowedStocksByUser(userAccount: UserAccount): Promise<any[]> {
    return await this.find({ where: { userId: userAccount.id } });
  }
}

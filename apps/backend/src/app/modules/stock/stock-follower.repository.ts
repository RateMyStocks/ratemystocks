import { StockFollower } from '../../../models/stockFollower.entity';
import { Repository, EntityRepository } from 'typeorm';
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
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockRatingRepository } from './stock-rating.repository';
import { getManager } from 'typeorm';
import { StockRatingOrderingDirection } from './stock-rating-ordering-direction';
import { StockRatingOrdering } from './stock-rating-ordering-enum';
import {
  StockRatingAggregation,
  StockRatingCountDto,
  StockRatingDto,
  StockRatingListDto,
} from '@ratemystocks/api-interface';
import { StockRating, StockRatingEnum } from '../../../models/stockRating.entity';
import { UserAccount } from '../../../models/userAccount.entity';
@Injectable()
export class StockService {
  constructor(@InjectRepository(StockRatingRepository) private stockRatingRepo: StockRatingRepository) {}

  /**
   * Counts the number of buy, sell and hold counts for a stock
   * @param ticker The ticker symbol of the stock
   * @return A DTO containing the buy, sell, and hold rating counts of the stock.
   */
  async getStockRatingCount(ticker: string): Promise<StockRatingCountDto> {
    const buy_count: number = await this.stockRatingRepo.count({
      where: {
        ticker: ticker,
        stockRating: StockRatingEnum.BUY,
        active: true,
      },
    });

    const sell_count: number = await this.stockRatingRepo.count({
      where: {
        ticker: ticker,
        stockRating: StockRatingEnum.SELL,
        active: true,
      },
    });

    const hold_count: number = await this.stockRatingRepo.count({
      where: {
        ticker: ticker,
        stockRating: StockRatingEnum.HOLD,
        active: true,
      },
    });

    return {
      buy: buy_count,
      sell: sell_count,
      hold: hold_count,
    };
  }

  /**
   * Gets the user's rating for a particular stock
   * @param ticker The ticker symbol of the stock
   * @param userAccount The logged-in user whose ratings are being loaded.
   * @return A DTO representing the user's rating for a given stock.
   */
  async getStockUserRating(ticker: string, userAccount: UserAccount): Promise<StockRatingDto> {
    const userStockRating: StockRating = await this.stockRatingRepo.findOne({
      where: {
        userAccount: userAccount,
        ticker: ticker,
        active: true,
      },
    });
    return { stockRating: userStockRating?.stockRating };
  }

  /**
   * Gets a list of stock ratings for a given user.
   * @param userId The UUID of the user to fetch stock ratings for.
   * @param showInactive True to return a full history of stock ratings, false to only show active ratings.
   * @return The list of stocks and their ratings from a given user.
   */
  async getUserStockRatings(userId: string, showInactive: boolean): Promise<StockRating[]> {
    const stockRatings: StockRating[] = await this.stockRatingRepo.find({
      where: showInactive === false ? { userId } : { userId, active: true },
    });

    return stockRatings;
  }

  /**
   * Updates or creates a new stock rating
   * @param ticker The ticker symbol of the stock
   * @param userAccount The logged-in user who is submitting a rating.
   * @param rating The incoming stock rating, either a Buy, Hold, or Sell
   */
  async addUserRating(ticker: string, userAccount: UserAccount, rating: StockRatingEnum): Promise<void> {
    const activeRating: StockRating = await this.stockRatingRepo.findOne({
      where: {
        userAccount,
        ticker,
        active: true,
      },
    });

    if (activeRating) {
      activeRating.active = false;
      await activeRating.save();
    }

    const stockRating: StockRating = new StockRating();
    stockRating.stockRating = rating;
    stockRating.userAccount = userAccount;
    stockRating.ticker = ticker;
    stockRating.active = true;
    await stockRating.save();
  }

  async getUserRatingHistory(ticker: string, userAccount: UserAccount): Promise<StockRating[]> {
    const ratings: StockRating[] = await this.stockRatingRepo.find({
      where: {
        userAccount,
        ticker,
      },
    });
    return ratings;
  }

  /**
   * Gets all the stocks that have been rated and returned based on what pagination parameters are passed in
   * @param pageSize size of the page, defaulted to 100
   * @param page number the page is on, defaulted to 1
   * @param orderBy which column we want to order by, defautled to ticker
   * @param orderDirection what direction the selected column is ordered, defaulted to ascending
   */
  async getStocks(
    pageSize = 100,
    page = 1,
    orderBy = StockRatingOrdering.TICKER,
    orderDirection = StockRatingOrderingDirection.ASC
  ): Promise<StockRatingListDto> {
    if (isNaN(pageSize)) throw new BadRequestException('Invalid pageSize has to be a number');
    if (isNaN(page)) throw new BadRequestException('Invalid page has to be a number');
    if (!(orderDirection.toUpperCase() in StockRatingOrderingDirection))
      throw new BadRequestException('Invalid orderDirection');
    if (!(orderBy.toUpperCase() in StockRatingOrdering)) throw new BadRequestException('Invalid orderBy');

    // TODO: USE PARAMETERIZED QUERIES
    const entityManager = getManager();
    const offset = (page - 1) * pageSize;
    const items: StockRatingAggregation[] = await entityManager.query(
      `
      SELECT sr.ticker AS ticker,
        SUM(case when sr.stock_rating = 'buy' AND sr.active IS TRUE then 1 else 0 end) AS buy_count,
        SUM(case when sr.stock_rating = 'hold' AND sr.active IS TRUE then 1 else 0 end) AS hold_count,
        SUM(case when sr.stock_rating = 'sell' AND sr.active IS TRUE then 1 else 0 end) AS sell_count
      FROM stock_rating sr
      GROUP BY ticker
      ORDER BY ${orderBy} ${orderDirection}
      LIMIT $1
      OFFSET $2;`,
      [pageSize, offset]
    );

    const countQuery = await this.stockRatingRepo
      .createQueryBuilder('stock_rating')
      .select('COUNT(DISTINCT ticker)')
      .getRawOne();

    return {
      items,
      totalCount: countQuery.count,
    };
  }
}

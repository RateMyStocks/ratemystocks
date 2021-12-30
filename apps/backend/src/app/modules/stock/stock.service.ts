import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockRatingRepository } from './stock-rating.repository';
import { StockRatingCountDto, StockRatingDto, StockRatingListItem } from '@ratemystocks/api-interface';
import { StockRating, StockRatingEnum } from '../../../models/stockRating.entity';
import { UserAccount } from '../../../models/userAccount.entity';
import { StockVisitRepository } from './stock-visit.repository';
import { StockVisit } from 'apps/backend/src/models/stockVisit.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockRatingRepository) private stockRatingRepo: StockRatingRepository,
    @InjectRepository(StockVisitRepository) private stockVisitRepo: StockVisitRepository
  ) {}

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
   * Gets the Top 100 "Most Popular" stocks, e.g. stocks with the highest total # of ratings
   * @param lastNDays The number of days from the current date to retrieve stock ratings for.
   * @return The list of stocks with their rating counts.
   */
  async getMostPopularStocks(lastNDays?: number): Promise<StockRatingListItem[]> {
    if (lastNDays && (isNaN(lastNDays) || lastNDays > 30)) {
      throw new BadRequestException('Invalid Number of Days');
    }

    const whereClause = lastNDays ? `sr.last_updated > NOW() - INTERVAL '${lastNDays} days'` : '';

    const stockRatings: StockRatingListItem[] = await this.stockRatingRepo
      .createQueryBuilder('sr')
      .select(
        `
            sr.ticker AS ticker,
            SUM(case when sr.stock_rating = 'buy' AND sr.active IS TRUE then 1 else 0 end) AS buy_count,
            SUM(case when sr.stock_rating = 'hold' AND sr.active IS TRUE then 1 else 0 end) AS hold_count,
            SUM(case when sr.stock_rating = 'sell' AND sr.active IS TRUE then 1 else 0 end) AS sell_count,
            SUM(case when sr.stock_rating = 'buy' AND sr.active IS TRUE then 1 else 0 end) + SUM(case when sr.stock_rating = 'hold' AND sr.active IS TRUE then 1 else 0 end) + SUM(case when sr.stock_rating = 'sell' AND sr.active IS TRUE then 1 else 0 end) AS total_count
        `
      )
      .addSelect(
        `ROW_NUMBER () OVER (ORDER BY (SUM(case when sr.stock_rating = 'buy' AND sr.active IS TRUE then 1 else 0 end) + SUM(case when sr.stock_rating = 'hold' AND sr.active IS TRUE then 1 else 0 end) + SUM(case when sr.stock_rating = 'sell' AND sr.active IS TRUE then 1 else 0 end)) DESC) as "rank"`
      )
      .where(whereClause)
      .groupBy('sr.ticker')
      .orderBy('total_count', 'DESC')
      .limit(100)
      .getRawMany();

    return stockRatings;
  }

  /**
   * Gets the Top 100 "Most Liked" stocks, e.g. stocks with the highest # of Buy ratings
   * @param lastNDays The number of days from the current date to retrieve stock ratings for.
   * @return The list of stocks with their rating counts.
   */
  async getMostLikedStocks(lastNDays?: number): Promise<StockRatingListItem[]> {
    if (lastNDays && (isNaN(lastNDays) || lastNDays > 30)) {
      throw new BadRequestException('Invalid Number of Days');
    }

    const whereClause = lastNDays ? `sr.last_updated > NOW() - INTERVAL '${lastNDays} days'` : '';

    const stockRatings: StockRatingListItem[] = await this.stockRatingRepo
      .createQueryBuilder('sr')
      .select(
        `
              sr.ticker AS ticker,
              SUM(case when sr.stock_rating = 'buy' AND sr.active IS TRUE then 1 else 0 end) AS buy_count,
              SUM(case when sr.stock_rating = 'hold' AND sr.active IS TRUE then 1 else 0 end) AS hold_count,
              SUM(case when sr.stock_rating = 'sell' AND sr.active IS TRUE then 1 else 0 end) AS sell_count
          `
      )
      .addSelect(
        `ROW_NUMBER () OVER (ORDER BY SUM(case when sr.stock_rating = 'buy' AND sr.active IS TRUE then 1 else 0 end) DESC) as "rank"`
      )
      .where(whereClause)
      .groupBy('sr.ticker')
      .orderBy('buy_count', 'DESC')
      .limit(100)
      .getRawMany();

    return stockRatings;
  }

  /**
   * Gets the Top 100 "Most Disliked" stocks, e.g. stocks with the highest # of Sell ratings
   * @param lastNDays The number of days from the current date to retrieve stock ratings for.
   * @return The list of stocks with their rating counts.
   */
  async getMostDislikedStocks(lastNDays?: number): Promise<StockRatingListItem[]> {
    if (lastNDays && (isNaN(lastNDays) || lastNDays > 30)) {
      throw new BadRequestException('Invalid Number of Days');
    }

    const whereClause = lastNDays ? `sr.last_updated > NOW() - INTERVAL '${lastNDays} days'` : '';

    const stockRatings: StockRatingListItem[] = await this.stockRatingRepo
      .createQueryBuilder('sr')
      .select(
        `
                sr.ticker AS ticker,
                SUM(case when sr.stock_rating = 'buy' AND sr.active IS TRUE then 1 else 0 end) AS buy_count,
                SUM(case when sr.stock_rating = 'hold' AND sr.active IS TRUE then 1 else 0 end) AS hold_count,
                SUM(case when sr.stock_rating = 'sell' AND sr.active IS TRUE then 1 else 0 end) AS sell_count
            `
      )
      .addSelect(
        `ROW_NUMBER () OVER (ORDER BY SUM(case when sr.stock_rating = 'sell' AND sr.active IS TRUE then 1 else 0 end) DESC) as "rank"`
      )
      .where(whereClause)
      .groupBy('sr.ticker')
      .orderBy('sell_count', 'DESC')
      .limit(100)
      .getRawMany();

    return stockRatings;
  }

  /**
   * Adds a visit to the stock_visit table indicating a page visit on a given stock page.
   * @param ticker The ticker symbol of the stock page being visited.
   * @param userId (Optional) If a logged-in user visits the stock page, this query parameter will be supplied.
   * @returns The number of page visits for a given stock ticker symbol.
   */
  async addStockPageVisit(ticker: string, userId?: string): Promise<number> {
    return this.stockVisitRepo.addStockPageVisit(ticker, userId);
  }
}

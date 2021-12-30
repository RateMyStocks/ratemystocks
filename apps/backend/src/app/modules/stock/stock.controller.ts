import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  IexCloudStockDataDto,
  StockRatingCountDto,
  StockRatingDto,
  StockRatingListItem,
} from '@ratemystocks/api-interface';
import { StockRating } from '../../../models/stockRating.entity';
import { UserAccount } from '../../../models/userAccount.entity';
import { GetUser } from '../auth/get-user.decorator';
import { IexCloudService } from '../iex-cloud/iex-cloud.service';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private iexCloudService: IexCloudService, private stockService: StockService) {}

  /**
   * Returns the stock info from IEX Cloud as well as the Stock Ratings counts from the database.
   * @param ticker The stock ticker symbol used to query IEX Cloud as well as the stock ratings table in the database.
   * @returns An object containing both the IexCloudStockDataDto & StockRatingCountDto.
   */
  @Get('/:ticker')
  async getStockData(
    @Param('ticker') ticker: string
  ): Promise<{ rating: StockRatingCountDto; data: IexCloudStockDataDto }> {
    const rating: StockRatingCountDto = await this.stockService.getStockRatingCount(ticker);
    const data: IexCloudStockDataDto = await this.iexCloudService.getStockData(ticker);

    return {
      data,
      rating,
    };
  }

  @Get('/rating/user/:ticker')
  @UseGuards(AuthGuard())
  getStockUserRating(@GetUser() userAccount: UserAccount, @Param('ticker') ticker: string): Promise<StockRatingDto> {
    return this.stockService.getStockUserRating(ticker, userAccount);
  }

  /**
   * Gets a list of stock ratings for a given user.
   * @param userId The UUID of the user to fetch stock ratings for.
   * @param showInactive True to return a full history of stock ratings, false to only show active ratings.
   * @return The list of stocks and their ratings from a given user.
   */
  @Get('/ratings/user/:userId')
  getStockRatingsForUser(
    @Param('userId') userId: string,
    @Query('showInactive') showInactive: boolean // technically all query params come in as strings in NestJS, but this should still work
  ): Promise<StockRating[]> {
    return this.stockService.getUserStockRatings(userId, showInactive);
  }

  @Post('/rating/user/:ticker')
  @UseGuards(AuthGuard())
  updateRating(
    @GetUser() userAccount: UserAccount,
    @Param('ticker') ticker: string,
    @Body() stockratingDto: StockRatingDto
  ): Promise<void> {
    return this.stockService.addUserRating(ticker, userAccount, stockratingDto.stockRating);
  }

  @Get('/rating/history/:ticker')
  @UseGuards(AuthGuard())
  getStockRatingHistory(@GetUser() userAccount: UserAccount, @Param('ticker') ticker: string): Promise<StockRating[]> {
    return this.stockService.getUserRatingHistory(ticker, userAccount);
  }

  /**
   * Gets the "Most Popular" stocks, e.g. stocks with the highest total # of ratings
   * @param lastNDays The number of days from the current date to retrieve stock ratings for.
   * @return The list of stocks with their rating counts.
   */
  @Get('/ratings/most-popular')
  getMostPopularStocks(@Query('lastNDays') lastNDays?: number): Promise<StockRatingListItem[]> {
    return this.stockService.getMostPopularStocks(lastNDays);
  }

  /**
   * Gets the "Most Liked" stocks, e.g. stocks with the highest # of Buy ratings
   * @param lastNDays The number of days from the current date to retrieve stock ratings for.
   * @return The list of stocks with their rating counts.
   */
  @Get('/ratings/most-liked')
  getMostLikedStocks(@Query('lastNDays') lastNDays?: number): Promise<StockRatingListItem[]> {
    return this.stockService.getMostLikedStocks(lastNDays);
  }

  /**
   * Gets the "Most Disliked" stocks, e.g. stocks with the highest # of Sell ratings
   * @param lastNDays The number of days from the current date to retrieve stock ratings for.
   * @return The list of stocks with their rating counts.
   */
  @Get('/ratings/most-disliked')
  getMostDislikedStocks(@Query('lastNDays') lastNDays?: number): Promise<StockRatingListItem[]> {
    return this.stockService.getMostDislikedStocks(lastNDays);
  }

  /**
   * Adds a visit to the stock_visit table indicating a page visit on a given stock page.
   * @param ticker The ticker symbol of the stock page being visited.
   * @param userId (Optional) If a logged-in user visits the stock page, this query parameter will be supplied.
   * @returns The number of page visits for a given stock ticker symbol.
   */
  @Post('/visit-count/:ticker')
  addStockPageVisit(@Param('ticker') ticker: string, @Query('userId') userId?: string): Promise<number> {
    return this.stockService.addStockPageVisit(ticker, userId);
  }
}

import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  IexCloudStockDataDto,
  StockRatingCountDto,
  StockRatingDto,
  StockRatingListDto,
} from '@ratemystocks/api-interface';
import { StockRating } from '../../../models/stockRating.entity';
import { UserAccount } from '../../../models/userAccount.entity';
import { GetUser } from '../auth/get-user.decorator';
import { IexCloudService } from '../iex-cloud/iex-cloud.service';
import { StockRatingOrderingDirection } from './stock-rating-ordering-direction';
import { StockRatingOrdering } from './stock-rating-ordering-enum';
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

  @Get('/rating/aggregation')
  getStocks(
    @Query('pageSize') pageSize?,
    @Query('page') page?,
    @Query('orderBy') orderBy?: StockRatingOrdering,
    @Query('orderDirection') orderDirection?: StockRatingOrderingDirection
  ): Promise<StockRatingListDto> {
    return this.stockService.getStocks(pageSize, page, orderBy, orderDirection);
  }
}

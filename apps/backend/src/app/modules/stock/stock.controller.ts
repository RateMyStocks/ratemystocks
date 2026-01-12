import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  CommentRatingDto,
  IexCloudStockDataDto,
  StockPageCommentDto,
  StockPageCommentsDto,
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
    @Param('userId', new ParseUUIDPipe()) userId: string,
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

  /**
   * Returns a list of the stock page visit counts for the last N days (defaults to 6).
   * @param ticker The ticker symbol of the stock to get the visit count sfor.
   * @param lastNDays Query param indicating the number of days from the current day to get visit counts for.
   * @returns A list of the stock page visit counts for the last N days.
   */
  @Get('/visit-counts/:ticker')
  getVisitCounts(@Param('ticker') ticker: string, @Query('lastNDays') lastNDays = 6): Promise<any[]> {
    return this.stockService.getVisitCounts(ticker, lastNDays);
  }

  /**
   * Creating an entry in the stock_follower table, thus tying a logged-in user to a given ticker symbol so they
   * can be notified of updates and news events later on.
   * @param userAccount The logged-in user following the stock.
   * @param ticker The ticker symbol of the stock page being followed.
   * @returns The number of page visits for a given stock ticker symbol.
   */
  @Post('/follow/:ticker')
  @UseGuards(AuthGuard())
  followStock(@GetUser() userAccount: UserAccount, @Param('ticker') ticker: string): Promise<void> {
    return this.stockService.followStock(userAccount, ticker);
  }

  /**
   * Deletes the entry in the stock_follower table, so the specified user
   * will unfollow a stock if it is already following it.
   * @param userAccount The account object of the logged-in user.
   * @param ticker The ticker symbol of the stock the user is following.
   * @throws NotFoundException If the user specified isn't actually following the stock.
   */
  @Delete('/unfollow/:ticker')
  @UseGuards(AuthGuard())
  unfollowStock(@GetUser() userAccount: UserAccount, @Param('ticker') ticker: string): Promise<void> {
    return this.stockService.unfollowStock(userAccount, ticker);
  }

  /**
   * Gets the number of followers for a given stock.
   * @param ticker The ticker symbol of the stock to get the number of followers for.
   * @return The number of followers for a given stock ticker symbol.
   */
  @Get('/follower-count/:ticker')
  getTotalFollowerCounts(@Param('ticker') ticker: string): Promise<number> {
    return this.stockService.getTotalFollowerCounts(ticker);
  }

  /**
   * Gets the number of followers by day for a given stock over a given time period.
   * @param ticker The ticker symbol of the stock to get the number of followers for.
   * @param lastNDays Optional query parameter indicating the past number of days to get counts for.
   * @return The number of followers by day for a given stock over a given time period.
   */
  @Get('/follower-counts/:ticker')
  getFollowerCountsLastNDays(@Param('ticker') ticker: string, @Query('lastNDays') lastNDays = 6): Promise<any[]> {
    return this.stockService.getFollowerCountsLastNDays(ticker, lastNDays);
  }

  /**
   * Returns true if the logged-in user is following a given stock, false otherwise.
   * @param userAccount The UserAccount object of the logged-in user.
   * @param ticker The ticker symbol of the stock to check against.
   * @returns true if the logged-in user is following a given stock, false otherwise.
   */
  @Get('/isfollowing/:ticker')
  @UseGuards(AuthGuard())
  isFollowingStock(@GetUser() userAccount: UserAccount, @Param('ticker') ticker: string): Promise<boolean> {
    return this.stockService.isFollowingStock(userAccount, ticker);
  }

  /**
   * Gets the most viewed stock tickers today.
   * @param numStocks The limit of stocks to get e.g. top 20 most viewed, top 10, etc.
   * @returns The most viewed stocks in the system in descending order.
   */
  @Get('/trending/today')
  getMostViewedStocksToday(@Query() numStocks?: number): Promise<any> {
    return this.stockService.getMostViewedStocksToday(numStocks);
  }

  /**
   *
   * @param ticker
   * @returns
   */
  @Get('/comments/:ticker')
  getStockPageComments(
    @Param('ticker') ticker: string,
    @Query('startIndex') startIndex?: number,
    @Query('pageSize') size?: number,
    @Query('sortDirection') sortDirection?: 'ASC' | 'DESC'
  ): Promise<StockPageCommentsDto> {
    return this.stockService.getStockPageComments(ticker, startIndex, size, sortDirection);
  }

  /**
   *
   * @param userAccount
   * @param ticker
   */
  @Post('/comments/:ticker')
  @UseGuards(AuthGuard())
  postStockPageComment(
    @GetUser() userAccount: UserAccount,
    @Param('ticker') ticker: string,
    @Body() postedCommentDto: StockPageCommentDto
  ): Promise<StockPageCommentDto> {
    return this.stockService.postStockPageComment(userAccount, ticker, postedCommentDto);
  }

  /**
   * Edits a user's own comment on a stock page.
   * @param userAccount
   * @returns
   */
   @Delete('/comments/:commentId')
   @UseGuards(AuthGuard())
   updateStockPageComment(@GetUser() userAccount: UserAccount): Promise<void> {
      return null;
    }

  /**
   * Deletes a user's own comment on a stock page.
   * @param userAccount
   * @returns
   */
  @Delete('/comments/:commentId')
  @UseGuards(AuthGuard())
  deleteStockPageComment(@GetUser() userAccount: UserAccount): Promise<void> {
    return null;
  }

  /**
   *
   * @param userAccount
   * @param commentId
   * @param commentRatingDto
   * @returns
   */
  @Put('/comments/:commentId/rating')
  @UseGuards(AuthGuard())
  likeOrDislikeStockPageComment(
    @GetUser() userAccount: UserAccount,
    @Param('commentId', new ParseUUIDPipe()) commentId: string,
    @Body() commentRatingDto: CommentRatingDto
  ): Promise<void> {
    return this.stockService.likeOrDislikeStockPageComment(commentId, userAccount.id, commentRatingDto);
  }

  // @Get('/comments/:commentId')
  // @UseGuards(AuthGuard())
  // getUsersStockPageCommentRatings

  // /**
  //  *
  //  * @param commentId
  //  * @returns
  //  */
  // @Get('/comments/:commentId')
  // getStockPageCommentLikeCount(@Param('commentId', new ParseUUIDPipe()) commentId: string): Promise<number> {
  //   return this.stockService.getStockPageCommentLikeCount(commentId);
  // }

  // @Get('/comments/:commentId/user')
  // getUserStockPageCommentRatings
}

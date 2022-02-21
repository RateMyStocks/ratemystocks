import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  CreatePortfolioDto,
  CreatePortfolioRatingDto,
  CreatePortfolioStockDto,
  ListPortfoliosDto,
  PortfolioStockDto,
  UserPortfolioDto,
} from '@ratemystocks/api-interface';
import { Portfolio } from '../../../models/portfolio.entity';
import { PortfolioRating } from '../../../models/portfolioRating.entity';
import { UserAccount } from '../../../models/userAccount.entity';
import { GetUser } from '../auth/get-user.decorator';
import { CreatePortfolioValidationPipe } from './pipes/create-portfolio-validation.pipe';
import { PortfolioService } from './portfolio.service';
import { PortfolioHoldingsValidationPipe } from './pipes/portfolio-holdings-validation.pipe';

@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get('/list')
  getPortfolios(
    @Query('pageSize') pageSize?: number,
    @Query('skip') skip?: number,
    @Query('orderBy') orderBy?: string,
    @Query('sortDirection') sortDirection?: 'ASC' | 'DESC',
    @Query('filter') filter?: string
  ): Promise<ListPortfoliosDto> {
    return this.portfolioService.getPortfolios(pageSize, skip, orderBy, sortDirection, filter);
  }

  /**
   * Gets a list of portfolios by user ID.
   * @param userId The UUID of the user whose portfolios will be fetched.
   * @return A list of DTOs representing the portfolios a user has created.
   */
  @Get('/list/:userId')
  getPortfoliosByUserId(@Param('userId') userId: string): Promise<UserPortfolioDto[]> {
    return this.portfolioService.getPortfoliosByUserId(userId);
  }

  // TODO: Don't return the entity and delete sensitive info - map the entity to a dto
  @Get('/:id')
  getPortfolioById(@Param('id') id: string): Promise<Portfolio> {
    return this.portfolioService.getPortfolioById(id);
  }

  @Get('/:id/stocks')
  getPortfolioStocks(@Param('id') id: string): Promise<PortfolioStockDto[]> {
    return this.portfolioService.getPortfolioStocks(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  createPortfolio(
    @GetUser() userAccount: UserAccount,
    @Body(CreatePortfolioValidationPipe) portfolio: CreatePortfolioDto
  ): Promise<Portfolio> {
    // TODO: Don't return the entity and delete sensitive info - map the entity to a dto
    return this.portfolioService.createPortfolio(portfolio, userAccount);
  }

  @Get('/:portfolioId/ratings')
  getPortfolioRatingCounts(@Param('portfolioId') portfolioId: string): Promise<{ likes: number; dislikes: number }> {
    return this.portfolioService.getPortfolioRatingCounts(portfolioId);
  }

  @Get('/:portfolioId/ratings/user')
  @UseGuards(AuthGuard())
  getPortfolioUserRating(
    @GetUser() userAccount: UserAccount,
    @Param('portfolioId') portfolioId: string
  ): Promise<PortfolioRating> {
    return this.portfolioService.getPortfolioUserRating(portfolioId, userAccount.id);
  }

  @Put('/:portfolioId/ratings/user')
  @UseGuards(AuthGuard())
  createOrUpdatePortfolioRating(
    @GetUser() userAccount: UserAccount,
    @Param('portfolioId') portfolioId,
    @Body() portfolioRatingDto: CreatePortfolioRatingDto
  ): Promise<PortfolioRating> {
    return this.portfolioService.createOrUpdatePortfolioRating(portfolioId, userAccount.id, portfolioRatingDto);
  }

  /**
   * Updates the name the portfolio.
   * @param userAccount The logged-in user who owns the portfolio.
   * @param portfolioId The unique UUID of the portfolio.
   * @param portfolioName The request body which contains the name to set on the portfolio.
   * @returns The portfolio with the updated name.
   */
  @Patch('/name/:portfolioId')
  @UseGuards(AuthGuard())
  updatePortfolioName(
    @GetUser() userAccount: UserAccount,
    @Param('portfolioId') portfolioId,
    @Body() portfolioName: { name: string }
  ): Promise<Portfolio> {
    // TODO: Don't return the entity and delete sensitive info - map the entity to a dto
    return this.portfolioService.updatePortfolioName(userAccount, portfolioId, portfolioName);
  }

  /**
   * Updates the description the portfolio.
   * @param userAccount The logged-in user who owns the portfolio.
   * @param portfolioId The unique UUID of the portfolio.
   * @param portfolioDescription The request body which contains the description to set on the portfolio.
   * @returns The portfolio with the updated name.
   */
  @Patch('/description/:portfolioId')
  @UseGuards(AuthGuard())
  updatePortfolioDescription(
    @GetUser() userAccount: UserAccount,
    @Param('portfolioId') portfolioId,
    @Body() portfolioDescription: { description: string }
  ): Promise<Portfolio> {
    // TODO: Don't return the entity and delete sensitive info - map the entity to a dto
    return this.portfolioService.updatePortfolioDescription(userAccount, portfolioId, portfolioDescription);
  }

  /**
   * Updates the holdings of a portfolio.
   * @param userAccount The logged-in user who owns the portfolio.
   * @param portfolioId The unique UUID of the portfolio.
   * @param portfolioHoldings DTo representing the updated holdings of the portfolio.
   * @returns The portfolio with the updated holdings.
   */
  @Patch('/holdings/:portfolioId')
  @UseGuards(AuthGuard())
  updatePortfolioHoldings(
    @GetUser() userAccount: UserAccount,
    @Param('portfolioId') portfolioId,
    @Body(PortfolioHoldingsValidationPipe) portfolioHoldings: { holdings: CreatePortfolioStockDto[] }
  ): Promise<Portfolio> {
    // TODO: This should return a DTO
    // TODO: Don't return the entity and delete sensitive info - map the entity to a dto
    return this.portfolioService.updatePortfolioHoldings(userAccount, portfolioId, portfolioHoldings);
  }

  /**
   * Deletes a Portfolio by it's unique id.
   * @param portfolioId The UUID of the portfolio to delete.
   */
  @Delete('/:id')
  @UseGuards(AuthGuard())
  deletePortfolioById(@Param('id') id): Promise<void> {
    return this.portfolioService.deletePortfolioById(id);
  }

  /**
   * Deletes the logged-in users rating for a given portfolio
   * @param portfolioRatingId The UUID of the portfolio to delete the rating from
   */
  @Delete('/:portfolioRatingId/ratings/user')
  @UseGuards(AuthGuard())
  deletePortfolioRating(@Param('portfolioRatingId') portfolioRatingId: string): Promise<void> {
    return this.portfolioService.deletePortfolioRating(portfolioRatingId);
  }

  /**
   * Adds a visit to the portfolio_visit table indicating a page visit for some portfolio.
   * @param portfolioId The portfolioId of the portfolio being visited.
   * @param userId (Optional) If a logged-in user visits the portfolio page, this query parameter will be supplied.
   * @returns The number of page visits for a given portfolio
   */
  @Post('/visit-count/:portfolioId')
  addStockPageVisit(@Param('portfolioId') portfolioId: string, @Query('userId') userId?: string): Promise<number> {
    return this.portfolioService.addPortfolioPageVisit(portfolioId, userId);
  }

  /**
   * Returns a list of the portfolio page visit counts for the last N days (defaults to 6).
   * @param portfolioId The id of the portfolio to get the visit count sfor.
   * @param lastNDays Query param indicating the number of days from the current day to get visit counts for.
   * @returns A list of the portfolio page visit counts for the last N days.
   */
  @Get('/visit-counts/:portfolioId')
  getVisitCounts(@Param('portfolioId') portfolioId: string, @Query('lastNDays') lastNDays = 6): Promise<any[]> {
    return this.portfolioService.getVisitCounts(portfolioId, lastNDays);
  }

  /**
   * Creating an entry in the portfolio_follower table allowing a user to follow a portfolio.
   * @param userAccount The logged-in user following the portfolio.
   * @param portfolioId The id of the portfolio being followed.
   * @returns The number of page visits for a given portfolio.
   */
  @Post('/follow/:portfolioId')
  @UseGuards(AuthGuard())
  followPortfolio(@GetUser() userAccount: UserAccount, @Param('portfolioId') portfolioId: string): Promise<void> {
    return this.portfolioService.followPortfolio(userAccount, portfolioId);
  }

  /**
   * Deletes the entry in the portfolio_follower table, so the specified user
   * will unfollow a portfolio if it is already following it.
   * @param userAccount The account object of the logged-in user.
   * @param portfolioId The id of the portfolio the user is following.
   * @throws 404 If the user specified isn't actually following the portfolio.
   */
  @Delete('/unfollow/:portfolioId')
  @UseGuards(AuthGuard())
  unfollowStock(@GetUser() userAccount: UserAccount, @Param('portfolioId') portfolioId: string): Promise<void> {
    return this.portfolioService.unfollowPortfolio(userAccount, portfolioId);
  }

  /**
   * Gets the number of followers for a given portfolio.
   * @param portfolioId The id of the portfolio to get the number of followers for.
   * @return The number of followers for a given portfolio.
   */
  @Get('/follower-count/:portfolioId')
  getTotalFollowerCounts(@Param('portfolioId') portfolioId: string): Promise<number> {
    return this.portfolioService.getTotalFollowerCounts(portfolioId);
  }

  /**
   * Gets the number of followers by day for a given portfolio over a given time period.
   * @param portfolioId The id of the portfolio to get the number of followers for.
   * @param lastNDays Optional query parameter indicating the past number of days to get counts for.
   * @return The number of followers by day for a given portfolio over a given time period.
   */
  @Get('/follower-counts/:portfolioId')
  getFollowerCountsLastNDays(
    @Param('portfolioId') portfolioId: string,
    @Query('lastNDays') lastNDays = 6
  ): Promise<any[]> {
    return this.portfolioService.getFollowerCountsLastNDays(portfolioId, lastNDays);
  }

  /**
   * Returns true if the logged-in user is following a given portfolio, false otherwise.
   * @param userAccount The UserAccount object of the logged-in user.
   * @param portfolioId The id of the portfolio to check against.
   * @returns true if the logged-in user is following a given portfolio, false otherwise.
   */
  @Get('/isfollowing/:portfolioId')
  @UseGuards(AuthGuard())
  isFollowingPortfolio(
    @GetUser() userAccount: UserAccount,
    @Param('portfolioId') portfolioId: string
  ): Promise<boolean> {
    return this.portfolioService.isFollowingPortfolio(userAccount, portfolioId);
  }
}

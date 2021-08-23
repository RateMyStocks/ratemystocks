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

  @Post()
  @UseGuards(AuthGuard())
  createPortfolio(
    @GetUser() userAccount: UserAccount,
    @Body(CreatePortfolioValidationPipe) portfolio: CreatePortfolioDto
  ): Promise<Portfolio> {
    // TODO: Don't return the entity and delete sensitive info - map the entity to a dto
    return this.portfolioService.createPortfolio(portfolio, userAccount);
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
   * @deprecated This method should not be used. The GraphQL Resolver should be used instead of these patch methods.
   *
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
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  CreatePortfolioDto,
  CreatePortfolioRatingDto,
  ListPortfoliosDto,
  PortfolioStockDto,
} from '@ratemystocks/api-interface';
import { Portfolio } from '../../../models/portfolio.entity';
import { PortfolioRating } from '../../../models/portfolioRating.entity';
import { UserAccount } from '../../../models/userAccount.entity';
import { GetUser } from '../auth/get-user.decorator';
import { CreatePortfolioValidationPipe } from './pipes/create-portfolio-validation.pipe';
import { PortfolioService } from './portfolio.service';
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
    return this.portfolioService.updatePortfolioDescription(userAccount, portfolioId, portfolioDescription);
  }

  @Delete('/:portfolioRatingId/ratings/user')
  @UseGuards(AuthGuard())
  deletePortfolioRating(@Param('portfolioRatingId') portfolioRatingId: string): Promise<void> {
    return this.portfolioService.deletePortfolioRating(portfolioRatingId);
  }
}

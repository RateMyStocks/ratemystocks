import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PortfolioRepository } from './portfolio.repository';
import { PortfolioStockRepository } from './portfolio-stock.repository';
import { Raw } from 'typeorm';
import { PortfolioRatingRepository } from './portfolio-rating.repository';
import {
  CreatePortfolioDto,
  CreatePortfolioRatingDto,
  CreatePortfolioStockDto,
  PortfolioRatingCountsDto,
  UserPortfolioDto,
} from '@ratemystocks/api-interface';
import { Portfolio } from '../../../models/portfolio.entity';
import { PortfolioStock } from '../../../models/portfolioStock.entity';
import { UserAccount } from '../../../models/userAccount.entity';
import { PortfolioRating } from '../../../models/portfolioRating.entity';
import { PortfolioVisitRepository } from './portfolio-visit.repository';
import { PortfolioFollowerRepository } from './portfolio-follower.repository';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(PortfolioRepository)
    private portfolioRepository: PortfolioRepository,
    @InjectRepository(PortfolioRatingRepository)
    private portfolioRatingRepository,
    @InjectRepository(PortfolioStockRepository)
    private portfolioStockRepository: PortfolioStockRepository,
    @InjectRepository(PortfolioVisitRepository)
    private portfolioVisitRepository: PortfolioVisitRepository,
    @InjectRepository(PortfolioFollowerRepository)
    private portfolioFollowerRepository: PortfolioFollowerRepository
  ) {}

  /**
   * TODO: Create a DTO for the return type
   *
   * Gets a list of portfolios from the database, optionally filtering by name, getting a subset of the
   * resutls with pagination, or sorting the results by column.
   * @param pageSize The number of portfolios to return.
   * @param skip The number of entries to skip at the beginning of the returned list
   * @param orderBy The column/field of the Portfolio to sort by.
   * @param sortDirection Either 'ASC' or 'DESC' to indicate whether to sort the 'orderBy' column in ascending or descending order.
   * @param filter The search text to filter portfolios by (currently only filtered by portfolio name).
   * @return An object including the list of portfolios from the database that may be filtered down, and also a total count of all portfolios in the system.
   */
  async getPortfolios(
    pageSize?: number,
    skip?: number,
    orderBy?: string,
    sortDirection?: 'ASC' | 'DESC',
    filter?: string
  ): Promise<{ items: any; totalCount: number }> {
    const orderByStatement = orderBy || 'num_likes, portfolio.name';

    // NOTE: Please use parameterized queries to prevent SQL injection
    const portfolios: any[] = await this.portfolioRepository
      .createQueryBuilder('portfolio')
      .select(
        `
          portfolio.id,
          portfolio.name,
          user.username AS username,
          user.spirit_animal,
          COUNT(distinct portfolioLikes.id) AS num_likes,
          COUNT(distinct portfolioDislikes.id) AS num_dislikes,
          largest_holding.ticker AS largest_holding,
          portfolio.lastUpdated AS last_updated,
          COUNT(distinct holdings.id) AS num_holdings
        `
      )
      .innerJoin('portfolio.user', 'user')
      .leftJoin('portfolio.ratings', 'portfolioLikes', 'portfolioLikes.isLiked IS TRUE')
      .leftJoin('portfolio.ratings', 'portfolioDislikes', 'portfolioDislikes.isLiked IS FALSE')
      .leftJoin('portfolio.stocks', 'holdings')
      .leftJoin(
        'portfolio_stock',
        'largest_holding',
        'largest_holding.id = (SELECT ps.id FROM portfolio_stock ps WHERE ps.portfolio_id = portfolio.id ORDER BY ps.weighting DESC LIMIT 1)'
      )
      .where(
        ':filterText = NULL OR (LOWER(portfolio.name) like LOWER(:filterText)) OR (LOWER(user.username) like LOWER(:filterText))',
        {
          filterText: `%${filter}%`,
        }
      )
      .groupBy('portfolio.id, user.username, user.spirit_animal, largest_holding.ticker')
      .limit(pageSize)
      .offset(skip)
      .orderBy(orderByStatement, sortDirection)
      .getRawMany();

    const totalPortfoliosCount: number = await this.portfolioRepository.count({
      where: {
        // NOTE: ILIKE is a case-insensitive pattern matching operator in Postgres
        name: Raw((alias) => `${alias} ILIKE '%${filter}%'`),
      },
    });

    return { items: portfolios, totalCount: totalPortfoliosCount };
  }

  /**
   * Gets a list of portfolios by user ID.
   * @param userId The UUID of the user whose portfolios will be fetched.
   * @return A list of DTOs representing the portfolios a user has created.
   */
  async getPortfoliosByUserId(userId: string): Promise<UserPortfolioDto[]> {
    // NOTE: Please use parameterized queries to prevent SQL injection
    const portfolios: any[] = await this.portfolioRepository
      .createQueryBuilder('portfolio')
      .select(
        `
          portfolio.id,
          portfolio.name,
          COUNT(distinct portfolioLikes.id) AS num_likes,
          COUNT(distinct portfolioDislikes.id) AS num_dislikes,
          largest_holding.ticker AS largest_holding,
          portfolio.lastUpdated AS last_updated,
          COUNT(distinct holdings.id) AS num_holdings
        `
      )
      .innerJoin('portfolio.user', 'user')
      .leftJoin('portfolio.ratings', 'portfolioLikes', 'portfolioLikes.isLiked IS TRUE')
      .leftJoin('portfolio.ratings', 'portfolioDislikes', 'portfolioDislikes.isLiked IS FALSE')
      .leftJoin('portfolio.stocks', 'holdings')
      .leftJoin(
        'portfolio_stock',
        'largest_holding',
        'largest_holding.id = (SELECT ps.id FROM portfolio_stock ps WHERE ps.portfolio_id = portfolio.id ORDER BY ps.weighting DESC LIMIT 1)'
      )
      .where('user.id = :userId', { userId: userId })
      .groupBy('portfolio.id, largest_holding.ticker')
      .getRawMany();

    return portfolios;
  }

  // TODO: Don't return the entity and delete sensitive info - instead map the entity to a dto
  /**
   * Gets a Portfolio entity from the database by its unique identifier.
   * @param id The UUID of the Portfolio entity in the database.
   */
  async getPortfolioById(id: string): Promise<Portfolio> {
    const found: Portfolio = await this.portfolioRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Portfolio with ID ${id} not found.`);
    }

    // TODO: Don't return the entity and delete sensitive info - map the entity to a dto
    // This data should not be sent back to the client
    delete found.user.password;
    delete found.user.salt;
    delete found.user.email;

    return found;
  }

  /**
   * Gets a list of stocks/holdings for a given Portfolio.
   * @param id The UUID of the Portfolio entity in the database whose stocks/holdings will be retrieved.
   * @return An array of PortfolioStock entities belonging to a given Portfolio.
   */
  async getPortfolioStocks(id: string): Promise<PortfolioStock[]> {
    const stocks: PortfolioStock[] = await this.portfolioStockRepository.find({ where: { portfolioId: id } });

    stocks.forEach((stock: PortfolioStock) => {
      delete stock.portfolio;
    });

    return stocks;
  }

  /**
   * Creates a Portfolio entity in the database.
   * @param portfolioDto The DTO used to create a Portfolio in the database.
   * @param userAccount The account of the logged-in user.
   */
  async createPortfolio(portfolioDto: CreatePortfolioDto, userAccount: UserAccount): Promise<Portfolio> {
    // TODO: Don't return the entity and delete sensitive info - map the entity to a dto
    return this.portfolioRepository.createPortfolio(portfolioDto, userAccount);
  }

  /**
   * Gets the likes & dislikes counts for a given portfolio.
   * @param portfolioId The UUID of the portfolio to get likes/dislikes counts for.
   * @return An object containing the likes & dislike counts for a given portfolio.
   */
  async getPortfolioRatingCounts(portfolioId: string): Promise<PortfolioRatingCountsDto> {
    const likes = await this.portfolioRatingRepository.count({ where: { portfolioId: portfolioId, isLiked: true } });
    const dislikes = await this.portfolioRatingRepository.count({
      where: { portfolioId: portfolioId, isLiked: false },
    });

    return { likes, dislikes };
  }

  /**
   * Retrieves a PortfolioRating from the database by the unique portfolio id, user id pair.
   * @param portfolioId The id of the portfolio to get a rating from.
   * @param userId The id of the user who submitted the portfolio rating.
   * @returns The PortfolioRating entity matching a given portfolio id & user id.
   */
  async getPortfolioUserRating(portfolioId: string, userId: string): Promise<PortfolioRating> {
    return await this.portfolioRatingRepository.findOne({ where: { portfolioId: portfolioId, userId: userId } });
  }

  /**
   * Updates the name the portfolio.
   * @param userAccount The logged-in user who owns the portfolio.
   * @param portfolioId The unique UUID of the portfolio.
   * @param portfolioName The object containing the name to set on the portfolio.
   * @returns The portfolio with the updated name.
   */
  async updatePortfolioName(
    userAccount: UserAccount,
    portfolioId: string,
    portfolioName: { name: string }
  ): Promise<Portfolio> {
    // TODO: Don't return the entity and delete sensitive info - map the entity to a dto
    const portfolio = await this.portfolioRepository.findOne({ where: { id: portfolioId, userId: userAccount.id } });

    // Throw 403 in the unlikely case that a user is attempting to update another user's portfolio or the portfolio is not found.
    if (!portfolio) {
      throw new ForbiddenException('You do not own this portfolio.');
    }

    portfolio.name = portfolioName.name;
    await portfolio.save();

    // After portfolio is saved, remove the sensitive User info from it so we don't send back it back to the client
    delete portfolio.user.password;
    delete portfolio.user.salt;
    delete portfolio.user.email;

    return portfolio;
  }

  /**
   * Updates the description of the portfolio.
   * @param userAccount The logged-in user who owns the portfolio.
   * @param portfolioId The unique UUID of the portfolio.
   * @param portfolioName The object containing the description to set on the portfolio.
   * @returns The portfolio with the updated description.
   */
  async updatePortfolioDescription(
    userAccount: UserAccount,
    portfolioId: string,
    portfolioDescription: { description: string }
  ): Promise<Portfolio> {
    // TODO: Don't return the entity and delete sensitive info - map the entity to a dto
    const portfolio = await this.portfolioRepository.findOne({ where: { id: portfolioId, userId: userAccount.id } });

    // Throw 403 in the unlikely case that a user is attempting to update another user's portfolio or the portfolio is not found.
    if (!portfolio) {
      throw new ForbiddenException('You do not own this portfolio.');
    }

    portfolio.description = portfolioDescription.description;
    await portfolio.save();

    // After portfolio is saved, remove the sensitive User info from it so we don't send back it back to the client
    delete portfolio.user.password;
    delete portfolio.user.salt;
    delete portfolio.user.email;

    return portfolio;
  }

  /**
   * Updates the holdings of a portfolio.
   * @param userAccount The logged-in user who owns the portfolio.
   * @param portfolioId The unique UUID of the portfolio.
   * @param portfolioHoldings DTo representing the updated holdings of the portfolio.
   * @returns The portfolio with the updated holdings.
   */
  async updatePortfolioHoldings(
    userAccount: UserAccount,
    portfolioId: string,
    portfolioHoldings: { holdings: CreatePortfolioStockDto[] }
  ): Promise<Portfolio> {
    // TODO: Don't return the entity and delete sensitive info - map the entity to a dto
    const portfolioEntity = await this.portfolioRepository.findOne({
      where: { id: portfolioId, userId: userAccount.id },
    });

    // Throw 403 in the unlikely case that a user is attempting to update another user's portfolio or the portfolio is not found.
    if (!portfolioEntity) {
      throw new ForbiddenException('You do not own this portfolio.');
    }

    const updatedStocks: PortfolioStock[] = [];

    portfolioHoldings.holdings.forEach((stockDto: CreatePortfolioStockDto) => {
      const stockEntity: PortfolioStock = new PortfolioStock();

      // For a create to happen, id has to be undefined (null won't work)
      stockEntity.id = stockDto.id ? stockDto.id : undefined;
      stockEntity.ticker = stockDto.ticker;
      stockEntity.weighting = stockDto.weighting;
      stockEntity.portfolioId = portfolioEntity.id;

      updatedStocks.push(stockEntity);
    });

    portfolioEntity.stocks = updatedStocks;
    portfolioEntity.lastUpdated = new Date();
    await portfolioEntity.save();

    // After portfolio is saved, remove the sensitive User info from it so we don't send back it back to the client
    delete portfolioEntity.user.password;
    delete portfolioEntity.user.salt;
    delete portfolioEntity.user.email;

    return portfolioEntity;
  }

  /**
   * Performs an upsert of a portfolioRating i.e. setting it to liked or disliked.
   * Uses the portfolioId and userId to find the portfolio rating if it exists, or creates a user rating for that portfolio.
   * @param portfolioId The Portfolio to upsert a rating on.
   * @param userId The user id of the user submitting the portfolio rating.
   * @returns The PortfolioRating entity that was created/updated.
   */
  async createOrUpdatePortfolioRating(
    portfolioId: string,
    userId: string,
    portfolioRatingDto: CreatePortfolioRatingDto
  ): Promise<PortfolioRating> {
    return await this.portfolioRatingRepository.createOrUpdatePortfolioRating(portfolioId, userId, portfolioRatingDto);
  }

  /**
   * Deletes a Portfolio by it's unique id.
   * @param portfolioId The UUID of the portfolio to delete.
   */
  async deletePortfolioById(portfolioId: string): Promise<void> {
    const result = await this.portfolioRepository.delete({ id: portfolioId });

    if (result.affected === 0) {
      throw new NotFoundException(`Portfolio with ID "${portfolioId} not found`);
    }
  }

  /**
   * Deletes a PortfolioRating by id.
   * @param portfolioRatingId The UUID of the PortfolioRating to delete.
   */
  async deletePortfolioRating(portfolioRatingId: string): Promise<void> {
    const result = await this.portfolioRatingRepository.delete({ id: portfolioRatingId });

    if (result.affected === 0) {
      throw new NotFoundException(`Portfolio Rating with ID "${portfolioRatingId} not found`);
    }
  }

  /**
   * Adds a visit to the portfolio_visit table indicating a page visit for some portfolio.
   * @param portfolioId The portfolioId of the portfolio being visited.
   * @param userId (Optional) If a logged-in user visits the portfolio page, this query parameter will be supplied.
   * @returns The number of page visits for a given portfolio
   */
  async addPortfolioPageVisit(ticker: string, userId?: string): Promise<number> {
    return this.portfolioVisitRepository.addPortfolioPageVisit(ticker, userId);
  }

  /**
   * Returns a list of the portfolio page visit counts for the last N days (defaults to 6).
   * @param portfolioId The id of the portfolio to get the visit count sfor.
   * @param lastNDays Query param indicating the number of days from the current day to get visit counts for.
   * @returns A list of the portfolio page visit counts for the last N days.
   */
  async getVisitCounts(ticker: string, lastNDays: number): Promise<any[]> {
    return this.portfolioVisitRepository.getVisitCounts(ticker, lastNDays);
  }

  /**
   * Creating an entry in the portfolio_follower table allowing a user to follow a portfolio.
   * @param userAccount The logged-in user following the portfolio.
   * @param portfolioId The id of the portfolio being followed.
   * @returns The number of page visits for a given portfolio.
   */
  async followPortfolio(userAccount: UserAccount, portfolioId: string): Promise<void> {
    return this.portfolioFollowerRepository.followPortfolio(userAccount, portfolioId);
  }

  /**
   * Deletes the entry in the portfolio_follower table, so the specified user
   * will unfollow a portfolio if it is already following it.
   * @param userAccount The account object of the logged-in user.
   * @param portfolioID The id of the portfolio the user is following.
   * @throws 404 If the user specified isn't actually following the portfolio.
   */
  async unfollowPortfolio(userAccount: UserAccount, portfolioId: string): Promise<void> {
    const result = await this.portfolioFollowerRepository.delete({ userId: userAccount.id, portfolioId });
    if (result.affected === 0) {
      throw new NotFoundException(`${userAccount.username} is not following ${portfolioId}.`);
    }
  }

  /**
   * Returns true if the logged-in user is following a given portfolio, false otherwise.
   * @param userAccount The UserAccount object of the logged-in user.
   * @param portfolioId The id of the portfolio to check against.
   * @returns true if the logged-in user is following a given portfolio, false otherwise.
   */
  async isFollowingPortfolio(userAccount: UserAccount, portfolioId: string): Promise<boolean> {
    const count: number = await this.portfolioFollowerRepository.count({ userId: userAccount.id, portfolioId });

    return count === 1;
  }

  /**
   * Gets the number of followers for a given portfolio.
   * @param portfolioId The id of the portfolio to get the number of followers for.
   * @return The number of followers for a given portfolio.
   */
  async getTotalFollowerCounts(portfolioId: string): Promise<number> {
    return await this.portfolioFollowerRepository.count({ where: { portfolioId } });
  }

  /**
   * Gets the number of followers by day for a given portfolio over a given time period.
   * @param portfolioId The id of the portfolio to get the number of followers for.
   * @param lastNDays Optional query parameter indicating the past number of days to get counts for.
   * @return The number of followers by day for a given portfolio over a given time period.
   */
  async getFollowerCountsLastNDays(portfolioId: string, lastNDays: number): Promise<any> {
    return this.portfolioFollowerRepository.getFollowerCountsLastNDays(portfolioId, lastNDays);
  }
}

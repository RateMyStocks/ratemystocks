import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PortfolioRepository } from './portfolio.repository';
import { PortfolioStockRepository } from './portfolio-stock.repository';
import { getManager, Raw } from 'typeorm';
import { PortfolioRatingRepository } from './portfolio-rating.repository';
import {
  CreatePortfolioDto,
  CreatePortfolioRatingDto,
  ListPortfoliosDto,
  PortfolioRatingCountsDto,
} from '@ratemystocks/api-interface';
import { Portfolio } from '../../../models/portfolio.entity';
import { PortfolioStock } from '../../../models/portfolioStock.entity';
import { UserAccount } from '../../../models/userAccount.entity';
import { PortfolioRating } from '../../../models/portfolioRating.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(PortfolioRepository)
    private portfolioRepository: PortfolioRepository,
    @InjectRepository(PortfolioRatingRepository)
    private portfolioRatingRepository,
    @InjectRepository(PortfolioStockRepository)
    private portfolioStockRepository: PortfolioStockRepository
  ) {}

  /**
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
  ): Promise<ListPortfoliosDto> {
    const orderByStatement = orderBy || 'num_likes, portfolio.name';

    // TODO: USED PARAMETERIZED QUERIES ONLY
    const portfolios: any[] = await getManager().query(
      `
      SELECT p.id, p.name, largest_holding.ticker AS largest_holding, u.username, COUNT(DISTINCT(p_likes.id)) AS num_likes, COUNT(DISTINCT(p_dislikes.id)) AS num_dislikes, COUNT(DISTINCT(holdings.id)) as num_holdings
      FROM portfolio p
      INNER JOIN user_account u ON (u.id = p.user_id)
      LEFT JOIN portfolio_rating p_likes ON (p.id = p_likes.portfolio_id AND p_likes.is_liked IS TRUE)
      LEFT JOIN portfolio_rating p_dislikes ON (p.id = p_dislikes.portfolio_id AND p_dislikes.is_liked IS FALSE)
      LEFT JOIN portfolio_stock largest_holding ON largest_holding.id = (
        SELECT ps.id FROM portfolio_stock ps
        WHERE ps.portfolio_id = p.id
        ORDER BY ps.weighting DESC
        LIMIT 1
      )
      LEFT JOIN portfolio_stock holdings ON (holdings.portfolio_id = p.id)
      WHERE ${!filter} IS TRUE OR (LOWER(p.name) like LOWER('%${filter}%'))
      GROUP BY p.id, u.id, largest_holding.id
      ORDER BY ${orderByStatement} ${sortDirection}
      LIMIT $1
      OFFSET $2
      `,
      [pageSize, skip]
    );

    const totalPortfoliosCount: number = await this.portfolioRepository.count({
      where: {
        // NOTE: ILIKE is a case-insensitive pattern matching operator in Postgres
        name: Raw((alias) => `${alias} ILIKE '%${filter}%'`),
      },
    });

    return { items: portfolios, totalCount: totalPortfoliosCount };
  }

  // TODO: Don't return the entity and delete sensitive info - map the entity to a dto
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
   * Deletes a PortfolioRating by id.
   * @param portfolioRatingId The UUID of the PortfolioRating to delete.
   */
  async deletePortfolioRating(portfolioRatingId: string): Promise<void> {
    const result = await this.portfolioRatingRepository.delete({ id: portfolioRatingId });

    if (result.affected === 0) {
      throw new NotFoundException(`Portfolio Rating with ID "${portfolioRatingId} not found`);
    }
  }
}

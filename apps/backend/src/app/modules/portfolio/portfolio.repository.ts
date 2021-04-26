import { EntityRepository, Repository } from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PortfolioStock } from '../../../models/portfolioStock.entity';
import { CreatePortfolioDto, PortfolioStockDto } from '@ratemystocks/api-interface';
import { Portfolio } from '../../../models/portfolio.entity';
import { UserAccount } from '../../../models/userAccount.entity';

@EntityRepository(Portfolio)
export class PortfolioRepository extends Repository<Portfolio> {
  /**
   * Takes a DTO with minimal data for creation and converts and returns a Portfolio entity.
   * @param portfolioDto The CreatePortfolioDto that will be used to create the Portfolio entity.
   * @param userAccount The account of the logged-in user.
   */
  async createPortfolio(portfolioDto: CreatePortfolioDto, userAccount: UserAccount): Promise<Portfolio> {
    const portfolioEntity = this.create();
    portfolioEntity.name = portfolioDto.name;
    portfolioEntity.description = portfolioDto.description;
    portfolioEntity.user = userAccount;
    portfolioEntity.dateCreated = new Date();
    portfolioEntity.lastUpdated = new Date();

    const holdings: PortfolioStock[] = [];
    portfolioDto.holdings.forEach((portfolioStockDto: PortfolioStockDto, index: number) => {
      const portfolioStockEntity = new PortfolioStock();
      portfolioStockEntity.ticker = portfolioStockDto.ticker;
      portfolioStockEntity.weighting = portfolioStockDto.weighting;

      holdings[index] = portfolioStockEntity;
    });

    portfolioEntity.stocks = holdings;

    try {
      await portfolioEntity.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `You have already created a portfolio with this name. Please use a different name to continue.`
        );
      } else {
        throw new InternalServerErrorException();
      }
    }

    // After portfolio is saved, remove the User from it so we don't send back sensitive info to the client
    delete portfolioEntity.user;

    return portfolioEntity;
  }
}

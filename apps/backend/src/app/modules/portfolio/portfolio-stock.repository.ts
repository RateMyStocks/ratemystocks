import { PortfolioStock } from '../../../models/portfolioStock.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreatePortfolioStockDto } from '@ratemystocks/api-interface';

@EntityRepository(PortfolioStock)
export class PortfolioStockRepository extends Repository<PortfolioStock> {
  async createOrUpdatePortfolioStock(
    portfolioId: string,
    portfolioStockDto: CreatePortfolioStockDto
  ): Promise<PortfolioStock> {
    const portfolioStockEntity = this.create();
    // For a create to happen, id has to be undefined (null won't work)
    portfolioStockEntity.id = portfolioStockDto.id ? portfolioStockDto.id : undefined;
    portfolioStockEntity.ticker = portfolioStockDto.ticker;
    portfolioStockEntity.weighting = portfolioStockDto.weighting;
    portfolioStockEntity.portfolioId = portfolioId;
    return await this.save(portfolioStockEntity);
  }
}

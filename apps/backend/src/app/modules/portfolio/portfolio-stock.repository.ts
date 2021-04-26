import { PortfolioStock } from '../../../models/portfolioStock.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PortfolioStock)
export class PortfolioStockRepository extends Repository<PortfolioStock> {}

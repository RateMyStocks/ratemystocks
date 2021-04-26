import { Repository, EntityRepository } from 'typeorm';
import { StockRating } from '../../../models/stockRating.entity';

@EntityRepository(StockRating)
export class StockRatingRepository extends Repository<StockRating> {}

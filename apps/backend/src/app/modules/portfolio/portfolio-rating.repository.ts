import { CreatePortfolioRatingDto } from '@ratemystocks/api-interface';
import { PortfolioRating } from '../../../models/portfolioRating.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PortfolioRating)
export class PortfolioRatingRepository extends Repository<PortfolioRating> {
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
    const portfolioRatingEntity = this.create();
    // For a create to happen, id has to be undefined (null won't work)
    portfolioRatingEntity.id = portfolioRatingDto.id ? portfolioRatingDto.id : undefined;
    portfolioRatingEntity.lastUpdated = new Date();
    portfolioRatingEntity.portfolioId = portfolioId;
    portfolioRatingEntity.userId = userId;
    portfolioRatingEntity.isLiked = portfolioRatingDto.isLiked;
    return await this.save(portfolioRatingEntity);
  }
}

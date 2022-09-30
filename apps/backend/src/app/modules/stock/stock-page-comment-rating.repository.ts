import { CommentRatingDto } from "@ratemystocks/api-interface";
import { EntityRepository, Repository } from "typeorm";
import { StockPageCommentRating } from "../../../models/stockPageCommentRating.entity";

@EntityRepository(StockPageCommentRating)
export class StockPageCommentRatingRepository extends Repository<StockPageCommentRating> {
  /**
   * Performs an upsert of a stockPageCommentRating i.e. setting it to liked or disliked.
   * Uses the comment and userId to find the portfolio rating if it exists, or creates a user rating for that comment.
   * @param commentId The comment to upsert a rating on.
   * @param userId The user id of the user liking or disliking a comment.
   * @returns The StockPageCommentRating entity that was created/updated.
   */
  async createOrUpdateLikeOrDislike(
    commentId: string,
    userId: string,
    stockPageCommentRatingDto: CommentRatingDto
  ): Promise<void> {
    const stockPageCommentRatingEntity = this.create();

    // TODO: if rating already exists AND "isLiked" is the same, throw a 409. Otherwise update the rating

    // For a create to happen, id has to be undefined (null won't work)
    stockPageCommentRatingEntity.id = stockPageCommentRatingDto.id || undefined;
    stockPageCommentRatingEntity.commentId = commentId;
    stockPageCommentRatingEntity.userId = userId;
    stockPageCommentRatingEntity.isLiked = stockPageCommentRatingDto.isLiked;
    await this.save(stockPageCommentRatingEntity);
  }
}

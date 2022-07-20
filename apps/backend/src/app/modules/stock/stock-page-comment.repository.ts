import { StockPageComment } from '../../../models/stockPageComment.entity';
import { Repository, EntityRepository } from 'typeorm';
import { StockPageCommentDto } from '@ratemystocks/api-interface';
import { UserAccount } from '../../../models/userAccount.entity';

@EntityRepository(StockPageComment)
export class StockPageCommentRepository extends Repository<StockPageComment> {
  /**
   *
   * @param userAccount
   * @param ticker
   * @param createStockPageCommentDto
   */
  async postComment(
    userAccount: UserAccount,
    ticker: string,
    postedCommentDto: StockPageCommentDto
  ): Promise<StockPageComment> {
    const entity: StockPageComment = this.create();
    entity.user = userAccount;
    entity.datetimePosted = new Date();
    entity.comment = postedCommentDto.comment;
    entity.ticker = ticker;

    await entity.save();

    return entity;
  }

  /**
   *
   * @param
   * @returns
   */
  async getStockPageComments(ticker: string, startIndex: number, pageSize: number, sortDirection?: 'ASC' | 'DESC'): Promise<StockPageComment[]> {
    const results: StockPageComment[] = await this.find({
      where: { ticker },
      order: { datetimePosted: sortDirection ? sortDirection : 'DESC' },
      skip: startIndex,
      take: pageSize,
    });

    return results;
  }
}

import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StockPageComment } from './stockPageComment.entity';
import { UserAccount } from './userAccount.entity';

@Entity({ name: 'stock_page_comment_like' })
export class StockPageCommentRating extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'is_liked', nullable: false })
  isLiked: boolean;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne((type) => UserAccount, (user) => user.stockPageCommentLikes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserAccount;

  @Column({ name: 'comment_id', type: 'uuid' })
  commentId: string;

  @ManyToOne((type) => StockPageComment, (stockPageComment) => stockPageComment.ratings, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: StockPageComment;
}

import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StockPageCommentLike } from './stockPageCommentLike.entity';
import { StockPageCommentReply } from './stockPageCommentReply.entity';
import { UserAccount } from './userAccount.entity';

@Entity({ name: 'stock_page_comment' })
export class StockPageComment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 5, nullable: false })
  ticker: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  comment: string;

  @Column({ name: 'post_date_time', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  datetimePosted: Date;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne((type) => UserAccount, (user) => user.stockPageComments, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserAccount;

  @OneToMany((type) => StockPageCommentLike, (StockPageCommentLike) => StockPageCommentLike.comment, { eager: false })
  likes: StockPageCommentLike[];

  @OneToMany((type) => StockPageCommentReply, (StockPageCommentReply) => StockPageCommentReply.comment, {
    eager: false,
  })
  replies: StockPageCommentReply[];
}

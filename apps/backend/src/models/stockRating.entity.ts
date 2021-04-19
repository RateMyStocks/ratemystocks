import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { StockRatingEnum } from './stock-rating.enum';
import { UserAccount } from './userAccount.entity';

@Entity({ name: 'stock_rating' })
@Index(['ticker', 'userAccount'], { unique: true, where: '"active" = true' })
export class StockRating extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    type => UserAccount,
    userAccount => userAccount.stockRatings,
    { nullable: false, onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'user_account_id' })
  userAccount: UserAccount;

  @Column({ nullable: false })
  ticker: string;

  @Column({ name: 'stock_rating', nullable: false })
  stockRating: StockRatingEnum;

  @Column({ nullable: true })
  active: boolean;

  @Column({ name: 'last_updated', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  lastUpdated: Date;
}

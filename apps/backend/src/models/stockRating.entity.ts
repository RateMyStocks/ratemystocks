// import { StockRatingEnum } from '@ratemystocks/api-interface';
import { BaseEntity, Check, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccount } from './userAccount.entity';

export const enum StockRatingEnum {
  BUY = 'buy',
  HOLD = 'hold',
  SELL = 'sell',
}

@Entity({ name: 'stock_rating' })
@Index(['ticker', 'userAccount'], { unique: true, where: '"active" = true' })
@Check(`"stock_rating" <> 'buy' OR "stock_rating" <> 'hold' OR "stock_rating" <> 'sell'`)
export class StockRating extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => UserAccount, (userAccount) => userAccount.stockRatings, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_account_id' })
  userAccount: UserAccount;

  @Column({ name: 'user_account_id', type: 'uuid' })
  userId: string;

  @Column({ nullable: false })
  ticker: string;

  // TODO:
  // @Column({
  //   name: 'stock_rating',
  //   type: 'enum',
  //   enum: StockRatingEnum
  // })
  @Column({ name: 'stock_rating', nullable: false })
  stockRating: StockRatingEnum;

  @Column({ nullable: true })
  active: boolean;

  @Column({ name: 'last_updated', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  lastUpdated: Date;
}

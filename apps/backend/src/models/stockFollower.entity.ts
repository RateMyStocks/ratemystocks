import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAccount } from './userAccount.entity';

/**
 * Entity representing a record of when a user followed/saved a certain stock.
 */
@Entity({ name: 'stock_follower' })
@Index(['ticker', 'userAccount'], { unique: true })
export class StockFollower extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => UserAccount, (userAccount) => userAccount.stockFollowers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_account_id' })
  userAccount: UserAccount;

  @Column({ name: 'user_account_id', type: 'uuid' })
  userId: string;

  @Column({ nullable: false })
  ticker: string;

  @Column({ name: 'date_followed', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  dateFollowed: Date;
}

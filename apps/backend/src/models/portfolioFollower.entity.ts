import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { UserAccount } from './userAccount.entity';

/**
 * Entity representing a record of when a user followed/saved a portfolio.
 */
@Entity({ name: 'portfolio_follower' })
@Index(['portfolioId', 'userAccount'], { unique: true })
export class PortfolioFollower extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => UserAccount, (userAccount) => userAccount.portfolioFollowers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_account_id' })
  userAccount: UserAccount;

  @Column({ name: 'user_account_id', type: 'uuid' })
  userId: string;

  @Column({ nullable: false, name: 'portfolio_id', type: 'uuid' })
  portfolioId: string;

  @ManyToOne((type) => Portfolio, (portfolio) => portfolio.followers, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'portfolio_id' })
  portfolio: Portfolio;

  @Column({ name: 'date_followed', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  dateFollowed: Date;
}

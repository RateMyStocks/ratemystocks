import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { UserAccount } from './userAccount.entity';

@Entity({ name: 'portfolio_visit' })
export class PortfolioVisit extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, name: 'portfolio_id', type: 'uuid' })
  portfolioId: string;

  @ManyToOne((type) => Portfolio, (portfolio) => portfolio.visits, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'portfolio_id' })
  portfolio: Portfolio;

  @ManyToOne((type) => UserAccount, (userAccount) => userAccount.portfolioVisits, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_account_id' })
  userAccount: UserAccount;

  @Column({ name: 'user_account_id', type: 'uuid', nullable: true })
  userId: string;

  @Column({ name: 'visit_date', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  visitDate: Date;
}

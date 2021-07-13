import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { PortfolioRating } from './portfolioRating.entity';
import { PortfolioStock } from './portfolioStock.entity';
import { UserAccount } from './userAccount.entity';

@Entity()
@Unique('uq_portfolio_name_userId', ['name', 'user'])
export class Portfolio extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false, default: '' })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ name: 'date_created', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  dateCreated: Date;

  @Column({ name: 'last_updated', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  lastUpdated: Date;

  @ManyToOne((type) => UserAccount, (user) => user.portfolios, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserAccount;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @OneToMany((type) => PortfolioRating, (portfolioRating) => portfolioRating.portfolio, { eager: false })
  ratings: PortfolioRating[];

  @OneToMany((type) => PortfolioStock, (portfolioStock) => portfolioStock.portfolio, {
    eager: false,
    cascade: ['insert', 'update'],
  })
  stocks: PortfolioStock[];
}

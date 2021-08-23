import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Portfolio } from './portfolio.entity';
import { UserAccount } from './userAccount.entity';

@ObjectType()
@Entity({ name: 'portfolio_rating' })
@Unique('uq_portfolioRating_portfolio_user', ['portfolio', 'user'])
export class PortfolioRating extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => UserAccount, (user) => user.portfolioRatings, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserAccount;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne((type) => Portfolio, (portfolio) => portfolio.ratings, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'portfolio_id' })
  portfolio: Portfolio;

  @Column({ name: 'portfolio_id', type: 'uuid' })
  portfolioId: string;

  @Field()
  @Column({ name: 'is_liked', nullable: false })
  isLiked: boolean;

  @Column({ name: 'last_updated', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  lastUpdated: Date;
}

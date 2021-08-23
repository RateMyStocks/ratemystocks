import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { PortfolioRating } from './portfolioRating.entity';
import { PortfolioStock } from './portfolioStock.entity';
import { UserAccount } from './userAccount.entity';

@ObjectType()
@Entity()
@Unique('uq_portfolio_name_userId', ['name', 'user'])
export class Portfolio extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255, nullable: false, default: '' })
  name: string;

  @Field()
  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Field()
  @Column({ name: 'date_created', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  dateCreated: Date;

  @Field()
  @Column({ name: 'last_updated', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  lastUpdated: Date;

  @Field((type) => UserAccount, { nullable: true })
  @ManyToOne((type) => UserAccount, (user) => user.portfolios, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserAccount;

  @Field()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @OneToMany((type) => PortfolioRating, (portfolioRating) => portfolioRating.portfolio, { eager: false })
  ratings: PortfolioRating[];

  @Field((type) => [PortfolioStock], { nullable: true })
  @OneToMany((type) => PortfolioStock, (portfolioStock) => portfolioStock.portfolio, {
    eager: false,
    cascade: ['insert', 'update'],
  })
  stocks: PortfolioStock[];

  @Field((type) => [UserAccount], { nullable: true })
  @ManyToMany(() => UserAccount, (user) => user.savedPortfolios)
  usersSaved: UserAccount[];
}

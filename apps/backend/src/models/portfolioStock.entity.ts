import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, Check, JoinColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Portfolio } from './portfolio.entity';

/**
 * Fixes a bug with Postgres Non-integer numbers always returned as string.
 */
export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@ObjectType()
@Entity({ name: 'portfolio_stock' })
@Unique('uq_portfolioStock_ticker', ['ticker', 'portfolio'])
@Check(`"weighting" >= 0 AND "weighting" <= 100`)
export class PortfolioStock extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 5, nullable: false })
  ticker: string;

  @Field()
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: false,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  weighting: number;

  @ManyToOne((type) => Portfolio, (portfolio) => portfolio.stocks, {
    nullable: false,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'portfolio_id' })
  portfolio: Portfolio;

  @Field()
  @Column({ name: 'portfolio_id', type: 'uuid' })
  portfolioId: string;
}

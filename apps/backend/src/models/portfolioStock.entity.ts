import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, Check, JoinColumn } from 'typeorm';
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

@Entity({ name: 'portfolio_stock' })
@Unique('uq_portfolioStock_ticker', ['ticker', 'portfolio'])
@Check(`"weighting" >= 0 AND "weighting" <= 100`)
export class PortfolioStock extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 5, nullable: false })
  ticker: string;

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

  @Column({ name: 'portfolio_id', type: 'uuid' })
  portfolioId: string;
}

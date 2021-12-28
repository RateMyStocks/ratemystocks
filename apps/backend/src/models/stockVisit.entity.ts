import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class StockVisitEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  ticker: string;

  @Column({ name: 'visit_date', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  visitDate: Date;
}

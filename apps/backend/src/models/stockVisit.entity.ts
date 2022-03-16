import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccount } from './userAccount.entity';

@Entity({ name: 'stock_visit' })
export class StockVisit extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  ticker: string;

  @ManyToOne((type) => UserAccount, (userAccount) => userAccount.stockVisits, {
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

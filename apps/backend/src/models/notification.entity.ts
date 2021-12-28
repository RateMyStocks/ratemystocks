import { BaseEntity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccount } from './userAccount.entity';

export class NotificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne((type) => UserAccount, (userAccount) => userAccount.notifications, { nullable: false, onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'user_account_id' })
  // userAccount: UserAccount;

  // @Column({ name: 'user_account_id', type: 'uuid' })
  // userId: string;

  @Column({ nullable: false })
  notifierId: string;

  @Column({ name: 'notification_date', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  notificationDate: Date;
}

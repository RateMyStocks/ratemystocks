import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique, ManyToMany, JoinTable } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { PortfolioRating } from './portfolioRating.entity';
import * as bcrypt from 'bcryptjs';
import { StockRating } from './stockRating.entity';
import { SpiritAnimal, UserRole } from '@ratemystocks/api-interface';
import { StockFollower } from './stockFollower.entity';
import { StockVisit } from './stockVisit.entity';

@Entity({ name: 'user_account' })
@Unique('uq_user_account_username', ['username'])
@Unique('uq_user_account_email', ['email'])
export class UserAccount extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  username: string;

  @Column({ type: 'citext', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column()
  salt: string;

  @OneToMany((type) => Portfolio, (portfolio) => portfolio.user, { eager: false, cascade: true })
  portfolios: Portfolio[];

  @OneToMany((type) => PortfolioRating, (portfolioRating) => portfolioRating.user, { eager: false, cascade: true })
  portfolioRatings: PortfolioRating[];

  @OneToMany((type) => StockRating, (stockRating) => stockRating.userAccount, { eager: false, cascade: true })
  stockRatings: StockRating[];

  // TODO: Add OneToMany relationship of User to notifications

  @OneToMany((type) => StockVisit, (stockVisit) => stockVisit.userAccount, { eager: false, cascade: true })
  stockVisits: StockVisit[];

  @OneToMany((type) => StockFollower, (stockFollower) => stockFollower.userAccount, { eager: false, cascade: true })
  stockFollowers: StockFollower[];

  // @Column({
  //   type: 'enum',
  //   enum: UserRole,
  //   default: UserRole.REGULAR,
  // })
  // role: UserRole;

  @Column({ name: 'date_joined', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  dateJoined: Date;

  @Column({ name: 'last_login', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  lastLogin: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  bio: string;

  // TODO: generate migration script to rename column using snakecase rather than camel case
  @Column({ type: 'boolean', nullable: false, default: true })
  isActive: boolean;

  // TODO: generate migration script to rename column using snakecase rather than camel case
  @Column({ type: 'boolean', nullable: false, default: false })
  emailVerified: boolean;

  @ManyToMany(() => Portfolio, (portfolio) => portfolio.usersSaved, {
    cascade: true,
  })
  @JoinTable()
  savedPortfolios: Portfolio[];

  @Column({
    name: 'spirit_animal',
    type: 'enum',
    enum: SpiritAnimal,
    default: SpiritAnimal.ANTELOPE,
  })
  spiritAnimal: SpiritAnimal;

  /**
   * Validates a plaintext password by hashing it and comparing it with the user's actual password.
   * @param password The plaintext password that will be hashed.
   * @return True if the hashed input password matches the password hash from the database.
   */
  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}

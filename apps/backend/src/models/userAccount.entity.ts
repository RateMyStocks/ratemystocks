import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { PortfolioRating } from './portfolioRating.entity';
import * as bcrypt from 'bcryptjs';
import { StockRating } from './stockRating.entity';
import { SpiritAnimal, UserRole } from '@ratemystocks/api-interface';

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

  // @Column({
  //   type: 'enum',
  //   enum: UserRole,
  //   default: UserRole.REGULAR,
  // })
  // role: UserRole;

  // TODO: Add Date Created column

  // TODO: Add Last Login column

  // TODO: add an about column

  // TODO: add an active column

  // TODO: Add verified column

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

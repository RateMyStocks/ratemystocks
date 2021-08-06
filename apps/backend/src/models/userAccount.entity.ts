import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique, ManyToMany, JoinTable } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Portfolio } from './portfolio.entity';
import { PortfolioRating } from './portfolioRating.entity';
import * as bcrypt from 'bcryptjs';
import { StockRating } from './stockRating.entity';
import { SpiritAnimal, UserRole } from '@ratemystocks/api-interface';

@ObjectType()
@Entity({ name: 'user_account' })
@Unique('uq_user_account_username', ['username'])
@Unique('uq_user_account_email', ['email'])
export class UserAccount extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 100, nullable: false })
  username: string;

  @Field()
  @Column({ type: 'citext', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Field()
  @Column()
  salt: string;

  @Field((type) => [Portfolio], { nullable: true })
  @OneToMany((type) => Portfolio, (portfolio) => portfolio.user, { eager: false, cascade: true })
  portfolios: Portfolio[];

  @Field((type) => [PortfolioRating], { nullable: true })
  @OneToMany((type) => PortfolioRating, (portfolioRating) => portfolioRating.user, { eager: false, cascade: true })
  portfolioRatings: PortfolioRating[];

  @Field((type) => [StockRating], { nullable: true })
  @OneToMany((type) => StockRating, (stockRating) => stockRating.userAccount, { eager: false, cascade: true })
  stockRatings: StockRating[];

  // @Column({
  //   type: 'enum',
  //   enum: UserRole,
  //   default: UserRole.REGULAR,
  // })
  // role: UserRole;

  // @Column({ name: 'date_joined', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  // dateJoined: Date;

  // @Column({ name: 'last_login', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  // lastLogin: Date;

  // @Column({ type: 'varchar', length: 200, nullable: true })
  // bio: string;

  // @Column({ type: 'boolean', nullable: false, default: true })
  // isActive: boolean;

  // @Column({ type: 'boolean', nullable: false, default: false })
  // emailVerified: boolean;

  @Field((type) => [Portfolio], { nullable: true })
  @ManyToMany(() => Portfolio, (portfolio) => portfolio.usersSaved, {
    cascade: true,
  })
  @JoinTable()
  savedPortfolios: Portfolio[];

  // @Field((type) => SpiritAnimal)
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

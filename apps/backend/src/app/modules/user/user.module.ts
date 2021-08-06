import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { PortfolioRepository } from '../portfolio/portfolio.repository';
import { PortfolioService } from '../portfolio/portfolio.service';
import { PortfolioRatingRepository } from '../portfolio/portfolio-rating.repository';
import { PortfolioStockRepository } from '../portfolio/portfolio-stock.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      PortfolioRepository,
      PortfolioRatingRepository,
      PortfolioStockRepository,
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserResolver, UserService, PortfolioService],
})
export class UserModule {}

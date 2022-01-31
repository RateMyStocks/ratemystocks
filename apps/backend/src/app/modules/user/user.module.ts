import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { PortfolioRepository } from '../portfolio/portfolio.repository';
import { StockFollowerRepository } from '../stock/stock-follower.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, PortfolioRepository, StockFollowerRepository]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

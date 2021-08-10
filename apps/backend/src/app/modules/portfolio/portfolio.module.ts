import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { IexCloudModule } from '../iex-cloud/iex-cloud.module';
import { IexCloudService } from '../iex-cloud/iex-cloud.service';
import { PortfolioRatingRepository } from './portfolio-rating.repository';
import { PortfolioStockRepository } from './portfolio-stock.repository';
import { PortfolioController } from './portfolio.controller';
import { PortfolioRepository } from './portfolio.repository';
import { PortfolioService } from './portfolio.service';
import { PortfolioResolver } from './portfolio.resolver';
import { UserService } from '../user/user.service';
import { UserRepository } from '../auth/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PortfolioRepository,
      PortfolioRatingRepository,
      PortfolioStockRepository,
      UserRepository,
    ]),
    IexCloudModule,
    AuthModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioResolver, PortfolioService, UserService, IexCloudService],
})
export class PortfolioModule {}

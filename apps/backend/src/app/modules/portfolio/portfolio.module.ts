import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { IexCloudModule } from '../iex-cloud/iex-cloud.module';
import { IexCloudService } from '../iex-cloud/iex-cloud.service';
import { PortfolioFollowerRepository } from './portfolio-follower.repository';
import { PortfolioRatingRepository } from './portfolio-rating.repository';
import { PortfolioStockRepository } from './portfolio-stock.repository';
import { PortfolioVisitRepository } from './portfolio-visit.repository';
import { PortfolioController } from './portfolio.controller';
import { PortfolioRepository } from './portfolio.repository';
import { PortfolioService } from './portfolio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PortfolioFollowerRepository,
      PortfolioRatingRepository,
      PortfolioRepository,
      PortfolioStockRepository,
      PortfolioVisitRepository,
    ]),
    IexCloudModule,
    AuthModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService, IexCloudService],
})
export class PortfolioModule {}

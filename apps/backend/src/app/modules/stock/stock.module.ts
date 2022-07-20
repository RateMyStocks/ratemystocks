import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { IexCloudModule } from '../iex-cloud/iex-cloud.module';
import { IexCloudService } from '../iex-cloud/iex-cloud.service';
import { StockRatingRepository } from '../stock/stock-rating.repository';
import { StockService } from '../stock/stock.service';
import { StockFollowerRepository } from './stock-follower.repository';
import { StockPageCommentRepository } from './stock-page-comment.repository';
import { StockVisitRepository } from './stock-visit.repository';
import { StockController } from './stock.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockRatingRepository, StockVisitRepository, StockFollowerRepository, StockPageCommentRepository]),
    IexCloudModule,
    AuthModule,
  ],
  controllers: [StockController],
  providers: [IexCloudService, StockService],
})
export class StockModule {}

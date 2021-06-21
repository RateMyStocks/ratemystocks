import { Module } from '@nestjs/common';

import { AngularUniversalModule } from '@nestjs/ng-universal';
import { configService } from '../config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AppServerModule } from './../../../frontend/src/app/app.server.module';
import { IexCloudModule } from './modules/iex-cloud/iex-cloud.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockModule } from './modules/stock/stock.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    AngularUniversalModule.forRoot({
      bootstrap: AppServerModule,
      viewsPath: join(process.cwd(), 'dist/frontend/browser'),
    }),
    AuthModule,
    IexCloudModule,
    PortfolioModule,
    StockModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

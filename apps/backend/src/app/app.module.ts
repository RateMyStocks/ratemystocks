import { Module } from '@nestjs/common';

import { AngularUniversalModule } from '@nestjs/ng-universal';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from '../config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AppServerModule } from './../../../frontend/src/app/app.server.module';
import { SidenavService } from 'apps/frontend/src/app/core/sidenav/sidenav.service';
import { IexCloudModule } from './modules/iex-cloud/iex-cloud.module';

@Module({
  imports: [
    AngularUniversalModule.forRoot({
      bootstrap: AppServerModule,
      viewsPath: join(process.cwd(), 'dist/frontend/browser'),
    }),
    IexCloudModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
  ],
  controllers: [AppController],
  providers: [AppService, SidenavService],
})
export class AppModule {}

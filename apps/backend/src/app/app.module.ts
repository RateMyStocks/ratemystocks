import { Module } from '@nestjs/common';

import { AngularUniversalModule } from '@nestjs/ng-universal';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AppServerModule } from './../../../frontend/src/app/app.server.module'; // * After
import { SidenavService } from 'apps/frontend/src/app/core/sidenav/sidenav.service';
import { IexCloudModule } from './modules/iex-cloud/iex-cloud.module';

@Module({
  imports: [
    AngularUniversalModule.forRoot({
      bootstrap: AppServerModule,
      viewsPath: join(process.cwd(), 'dist/frontend/browser'),
    }),
    IexCloudModule,
  ],
  controllers: [AppController],
  providers: [AppService, SidenavService],
})
export class AppModule {}

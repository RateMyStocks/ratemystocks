import { Module } from '@nestjs/common';

import { AngularUniversalModule } from '@nestjs/ng-universal';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
// import { AppServerModule } from '../src/main.server'; * Before

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AppServerModule } from './../../../frontend/src/app/app.server.module'; // * After

@Module({
  imports: [
    // Added import
    AngularUniversalModule.forRoot({
      bootstrap: AppServerModule,
      viewsPath: join(process.cwd(), 'dist/frontend/browser'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

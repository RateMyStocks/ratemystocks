/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';

require('dotenv').config();

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // You must specify NODE_ENV due to a weird NestJS/Nx issue: https://stackoverflow.com/questions/58090082/process-env-node-env-always-development-when-building-nestjs-app-with-nrwl-nx
  if (process.env['NODE' + '_ENV'] === 'local') {
    app.enableCors({
      credentials: true,
      origin: true,
      allowedHeaders: ['Origin, X-Requested-With, Content-Type, Accept, Authorization'],
      methods: ['GET, POST, PATCH, DELETE, PUT, OPTIONS'],
    });
  } else {
    const whitelist = ['https://ratemystocks.com', 'https://ratemystocks-staging.herokuapp.com'];
    app.enableCors({
      credentials: true,
      origin: (origin, callback) => {
        console.log('ORIGN: ', origin);
        if (whitelist.indexOf(origin) !== -1) {
          logger.log('Allowed CORS for:', origin);
          callback(null, true);
          logger.log(`Accepting requests from origin ${origin}`);
        } else {
          logger.log('Blocked CORS for:', origin);
          callback(new Error('Not allowed by CORS'));
        }
      },
      allowedHeaders: ['Origin, X-Requested-With, Content-Type, Accept, Authorization'],
      methods: ['GET, POST, PATCH, DELETE, PUT, OPTIONS'],
    });
  }

  await app.listen(process.env.PORT || 4000);
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  bootstrap().catch((err) => console.error(err));
}

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as CookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });

  app.setGlobalPrefix('api');

  // TODO: Only allow requests from frontend
  // if (process.env.NODE_ENV === 'development') {
  //   app.enableCors();
  // } else {
  //   app.enableCors({ origin: serverConfig.origin });
  //   logger.log(`Accepting requests from origin "${serverConfig.origin}"`);
  // }
  app.enableCors({
    credentials: true,
    origin: true,
    allowedHeaders: ['Origin, X-Requested-With, Content-Type, Accept, Authorization'],
    methods: ['GET, POST, PATCH, DELETE, PUT, OPTIONS'],
  });
  app.use(CookieParser());
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

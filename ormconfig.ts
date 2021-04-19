import { TypeOrmModuleOptions } from '@nestjs/typeorm';

require('dotenv').config();

/** This root-level TypeORM config is referenced in a package.json script to generate TypeOrm migration files. */
const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/apps/backend/src/models/*.entity{.ts,.js}'],
  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically, you can disable this if you prefer running migration manually.
  // If you set migrationsRun to false, you will have to use npm run typeorm:run to apply the migration, otherwise all migrations are applied automatically at application start.
  // migrationsRun: true,
  logging: true,
  ssl: process.env.MODE !== 'DEV' ? true : false,

  // Allow both start:prod and start:dev to use migrations __dirname is either dist or src folder, meaning either the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/apps/backend/src/migrations/*{.ts,.js}'],
  migrationsTableName: 'migration',
  cli: {
    migrationsDir: 'apps/backend/src/migrations',
  },
};

export = typeOrmConfig;

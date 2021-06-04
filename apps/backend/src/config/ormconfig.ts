import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { InitialSchema1622094105302 } from '../migrations/1622094105302-Initial_Schema';
import { Portfolio } from '../models/portfolio.entity';
import { PortfolioRating } from '../models/portfolioRating.entity';
import { PortfolioStock } from '../models/portfolioStock.entity';
import { StockRating } from '../models/stockRating.entity';
import { UserAccount } from '../models/userAccount.entity';

require('dotenv').config();

/** This TypeORM config is referenced in a package.json script to generate TypeOrm migration files. */
const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  // Database connection string containing the database name, port, username, & password.
  // Note: Heroku prefers this format.
  url: process.env.MODE !== 'DEV' ? process.env.DATABASE_URL + '?sslmode=require' : process.env.DATABASE_URL,
  // Unfortunately Nx will use webpack to generate a single main.js, so glob patterns won't work right when you deploy the dist.
  // Therefore, you must manually import & add new entities to this array.
  entities: [Portfolio, PortfolioRating, PortfolioStock, StockRating, UserAccount],
  // We are using migrations, so synchronize should be set to false.
  synchronize: false,
  logging: true,
  ssl: process.env.MODE !== 'DEV' ? { rejectUnauthorized: false } : false,
  // Unfortunately Nx will use webpack to generate a single main.js, so glob patterns won't work right when you deploy the dist.
  // Therefore, you must manually import & add new migrations to this array.
  migrations: [InitialSchema1622094105302],
  // Run migrations automatically, you can disable this if you prefer running migration manually.
  // If you set migrationsRun to false, you will have to use npm run typeorm:run to apply the migration, otherwise all migrations are applied automatically at application start.
  // migrationsRun: true,
  migrationsRun: true,
  // This is the name of migration table in the database.
  migrationsTableName: 'migration',
  cli: {
    // This is the folder that a generated migration file will be output to
    migrationsDir: 'apps/backend/src/migrations',
  },
};

export = typeOrmConfig;

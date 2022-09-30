import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { InitialSchema1622094105302 } from '../migrations/1622094105302-Initial_Schema';
import { UserSavedPortfoliosJoinTable1627260435599 } from '../migrations/1627260435599-User_Saved_Portfolios_Join_Table';
import { AddAdditionalUserColumns1631501858665 } from '../migrations/1631501858665-Add_Additional_User_Columns';
import { CreateStockFollowerAndVisitsTables1640843121560 } from '../migrations/1640843121560-Create_Stock_Follower_And_Visits_Tables';
import { CreatePortfolioFollowerAndVisitsTables1645382312844 } from '../migrations/1645382312844-Create_Portfolio_Follower_And_Visits_Tables';
import { StockPageComments1658733021350 } from '../migrations/1658733021350-Stock_Page_Comments';
import { StockPageCommentLike1663736094492 } from '../migrations/1663736094492-Stock_Page_Comment_Like';
import { Portfolio } from '../models/portfolio.entity';
import { PortfolioFollower } from '../models/portfolioFollower.entity';
import { PortfolioRating } from '../models/portfolioRating.entity';
import { PortfolioStock } from '../models/portfolioStock.entity';
import { PortfolioVisit } from '../models/portfolioVisit.entity';
import { StockFollower } from '../models/stockFollower.entity';
import { StockPageComment } from '../models/stockPageComment.entity';
import { StockPageCommentRating } from '../models/stockPageCommentRating.entity';
import { StockRating } from '../models/stockRating.entity';
import { StockVisit } from '../models/stockVisit.entity';
import { UserAccount } from '../models/userAccount.entity';

require('dotenv').config();

/** This TypeORM config is referenced in a package.json script to generate TypeOrm migration files. */
const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL, // Database connection string containing the database name, port, username, & password. Note: Heroku uses this format over specifying name, port, username individually.
  // Unfortunately Nx will use webpack to generate a single main.js, so glob patterns won't work right when you deploy the dist.
  // Therefore, you must manually import & add new entities to this array.
  entities: [
    Portfolio,
    PortfolioFollower,
    PortfolioRating,
    PortfolioStock,
    PortfolioVisit,
    StockFollower,
    StockPageComment,
    StockPageCommentRating,
    StockVisit,
    StockRating,
    UserAccount,
  ],
  synchronize: false, // We are using migrations, so synchronize should be set to false.
  logging: true,
  // You must specify NODE_ENV due to a weird NestJS/Nx issue: https://stackoverflow.com/questions/58090082/process-env-node-env-always-development-when-building-nestjs-app-with-nrwl-nx
  ssl: process.env['NODE' + '_ENV'] !== 'local' ? { rejectUnauthorized: false } : false,
  // Unfortunately Nx will use webpack to generate a single main.js, so glob patterns won't work right when you deploy the dist.
  // Therefore, you must manually import & add new migrations to this array.
  migrations: [
    InitialSchema1622094105302,
    UserSavedPortfoliosJoinTable1627260435599,
    AddAdditionalUserColumns1631501858665,
    CreateStockFollowerAndVisitsTables1640843121560,
    CreatePortfolioFollowerAndVisitsTables1645382312844,
    StockPageComments1658733021350,
    StockPageCommentLike1663736094492,
  ],
  // Run migrations automatically, you can disable this if you prefer running migration manually.
  // If you set migrationsRun to false, you will have to use npm run typeorm:run to apply the migration, otherwise all migrations are applied automatically at application start.
  // migrationsRun: true,
  migrationsRun: true,
  migrationsTableName: 'migration', // Name of migration table in the database.
  cli: {
    migrationsDir: 'apps/backend/src/migrations', // Folder that a generated migration file will be output to
  },
};

export = typeOrmConfig;

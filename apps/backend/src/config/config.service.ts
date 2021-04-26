import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { InitialSchema1619147036371 } from '../migrations/1619147036371-Initial_Schema';
import { Portfolio } from '../models/portfolio.entity';
import { PortfolioRating } from '../models/portfolioRating.entity';
import { PortfolioStock } from '../models/portfolioStock.entity';
import { StockRating } from '../models/stockRating.entity';
import { UserAccount } from '../models/userAccount.entity';

require('dotenv').config();

export class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    console.log('CONNECTING TO DATABASE!');
    return {
      type: 'postgres',
      url: this.getValue('DATABASE_URL'),
      ssl: this.isProduction(),
      logging: true,
      entities: [Portfolio, PortfolioRating, PortfolioStock, StockRating, UserAccount],
      // entities: [__dirname + '/models/*.entity{.ts,.js}'],
      // migrationsRun: true,
      migrationsTableName: 'migration',
      // migrations: [__dirname + '/migrations/*.ts'],
      migrations: [InitialSchema1619147036371],
      cli: {
        migrationsDir: 'src/migration',
      },
    };
  }
}

const configService = new ConfigService(process.env).ensureValues(['DATABASE_URL']);

export { configService };

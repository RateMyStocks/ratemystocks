import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import typeOrmConfig = require('./ormconfig');

require('dotenv').config();

/** Used to connect the application to the database. */
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

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    console.log('CONNECTING TO DATABASE!');
    return typeOrmConfig;
  }
}

const configService = new ConfigService(process.env).ensureValues(['DATABASE_URL']);

export { configService };

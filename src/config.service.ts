import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export class ConfigService {
  private static _instance: TypeOrmModuleOptions;

  private constructor(private env: { [k: string]: string | undefined }) {}

  public static get instance(): TypeOrmModuleOptions {
    if (!this._instance) {
      this._instance = new this(process.env)
        .ensureValues(['POSTGRES_HOST', 'POSTGRES_PORT', 'POSTGRES_USERNAME', 'POSTGRES_PASSWORD', 'POSTGRES_DATABASE'])
        .getTypeOrmConfig();
    }

    return this._instance;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((key) => {
      const value = this.env[key];

      if (!value) {
        throw new Error(`config error - missing env.${key}`);
      }
    });

    return this;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,

      //   logging: true, // true
      logging: false, // true
      synchronize: false,
      entities: ['dist/**/*.entity.js'],

      migrationsTableName: 'migrations',
      migrations: ['src/database/migration/*.ts'],

      cli: {
        migrationsDir: 'src/database/migration',
      },
    };
  }
}

// const configService = new ConfigService(process.env).ensureValues([
//   'POSTGRES_HOST',
//   'POSTGRES_PORT',
//   'POSTGRES_USERNAME',
//   'POSTGRES_PASSWORD',
//   'POSTGRES_DATABASE',
// ]);

// export { configService };

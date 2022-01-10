import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export declare class TypeormConfig {
    private env;
    private static _instance;
    private constructor();
    static get instance(): TypeOrmModuleOptions;
    ensureValues(keys: string[]): this;
    getTypeOrmConfig(): TypeOrmModuleOptions;
}

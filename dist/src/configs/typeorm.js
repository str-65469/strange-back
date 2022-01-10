"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeormConfig = void 0;
const dotenv = require("dotenv");
dotenv.config();
class TypeormConfig {
    constructor(env) {
        this.env = env;
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new this(process.env)
                .ensureValues([
                'POSTGRES_HOST',
                'POSTGRES_PORT',
                'POSTGRES_USERNAME',
                'POSTGRES_PASSWORD',
                'POSTGRES_DATABASE',
            ])
                .getTypeOrmConfig();
        }
        return this._instance;
    }
    ensureValues(keys) {
        keys.forEach((key) => {
            const value = this.env[key];
            if (!value) {
                throw new Error(`config error - missing env.${key}`);
            }
        });
        return this;
    }
    getTypeOrmConfig() {
        return {
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            logging: false,
            synchronize: false,
            migrationsTableName: 'migrations',
            migrations: ['dist/src/database/migrations/*.js'],
            entities: [__dirname + '/../**/*.entity.{js,ts}'],
            cli: {
                migrationsDir: 'src/database/migration',
            },
        };
    }
}
exports.TypeormConfig = TypeormConfig;
//# sourceMappingURL=typeorm.js.map
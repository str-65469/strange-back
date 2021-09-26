module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,

  synchronize: false,
  migrationsRun: false,
  migrationsTableName: 'migrations',

  entities: ['src/database/entity/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};

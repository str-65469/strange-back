import { createConnection } from 'typeorm';
import { testing } from './test';
import { config } from 'dotenv';

const app = async () => {
  // load env variables
  config({ debug: process.env.NODE_ENV === 'development' });

  const connection = await createConnection({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  });

  await testing(connection);

  connection.close();
};

app();

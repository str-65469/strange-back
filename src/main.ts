import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

/**
 *!	In this order
 ** run: yarn (for new packages)
 ** add new env variables
 ** delete all register cache
 ** run: yarn migrate:generate
 ** check last generated file before runnning
 ** run: yarn migrate:run
 *
 */

NestFactory.create<NestExpressApplication>(AppModule).then(async (app) => {
  const port = 4000;

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useStaticAssets(join(__dirname, '../..', 'upload'), { prefix: '/upload' });
  app.useStaticAssets(join(__dirname, '../..', 'public'), { prefix: '/public' });
  //   app.useStaticAssets(join(__dirname, '../..', 'static'), { prefix: '/static' });
  app.setViewEngine('hbs');
  app.set('trust proxy', 1);

  await app.listen(port);
  console.log({ DEBUG_MODE: process.env.NODE_ENV, PORT: port });
});

/**
 *!		| socket refresh token
 *TODO	| remove crypto not used anywhere
 *TODO	| use some date library like moment.js
 *TODO 	| add custom exception in every exception
 *? 	| socket flow helped greatly (https://stackoverflow.com/questions/17476294/how-to-send-a-message-to-a-particular-client-with-socket-io)
 */

/**
 * ! old package json code
 * "migratemain": "yarn run typeorm migration:generate -n Main",
 * "clean": "rimraf src/database/migrations/*",
 * "migrate": "yarn run clean && yarn run migratemain && yarn run migrate:run"
 */

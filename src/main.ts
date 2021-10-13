import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

// import { config } from 'rxjs';
// config.onUnhandledError = console.log;

//TODO remove crypto not used anywhere
//TODO add custom exception in every exception
// socket flow helped greatly (https://stackoverflow.com/questions/17476294/how-to-send-a-message-to-a-particular-client-with-socket-io)

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    // origin: [
    //   'http://localhost:5000', // react markup
    //   'http://localhost:3000', // react dashboard
    // ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  const PORT = 4000;

  await app.listen(PORT);

  console.log({ DEBUG_MODE: process.env.NODE_ENV, PORT: PORT });
}
bootstrap();

import * as cookieParser from 'cookie-parser';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app/modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AllExceptionsFilter } from './app/common/exception_filters/all_exception.filter';

NestFactory.create<NestExpressApplication>(AppModule).then(async (app) => {
  const port = 4000;

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  app.enableCors({ origin: true, methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', credentials: true });
  app.useStaticAssets(join(__dirname, '../..', 'upload'), { prefix: '/upload' });
  app.useStaticAssets(join(__dirname, '../..', 'public'), { prefix: '/public' });
  app.setViewEngine('hbs');
  app.set('trust proxy', 1);

  await app.listen(port);

  console.log({ DEBUG_MODE: process.env.NODE_ENV, PORT: port });
});

/**
 * ? informative
 *		| use some date library like moment.js
 *		| socket flow helped greatly (https://stackoverflow.com/questions/17476294/how-to-send-a-message-to-a-particular-client-with-socket-io)

 * ! old package json code
 * 		| "migratemain": "yarn run typeorm migration:generate -n Main",
 * 		| "clean": "rimraf src/database/migrations/*",
 * 		| "migrate": "yarn run clean && yarn run migratemain && yarn run migrate:run"
 * 
 * ! bash
 * 		| if (process.env.NODE_ENV !== 'development') {
 * 		|    return 'not so fast';
 * 		| }
 * 		| const automatePath = path.join(__dirname, '../../', '/automates/test.sh');
 * 		| chProccess.exec(`sh ${automatePath}`, (error, stdout, stderr) => {
 * 		| console.log(stdout);
 * 		| console.log(stderr);
 * 		| if (error !== null) {
 * 		| 	console.log(`exec error: ${error}`);
 * 		| }
 * 		| });
 * 		| return `sh ${automatePath}`;
 *
 * ! cleanall
 * 		| if (process.env.NODE_ENV !== 'development') {
 * 		|   return 'not so fast';
 * 		| }
 * 		| getRepository(MatchingSpams)
 * 		|   .createQueryBuilder()
 * 		|   .update()
 * 		|   .set({ accept_list: [], decline_list: [], remove_list: [], matched_list: [] })
 * 		|   .execute();
 * 		| getRepository(MatchedDuos).createQueryBuilder().delete().where('id > 0').execute();
 * 		| getRepository(MatchedDuosNotifications).createQueryBuilder().delete().where('id > 0').execute();
 * 		| getRepository(MatchingLobby).createQueryBuilder().delete().where('id > 0').execute();
 * 		| return 'cleaned';
 *
 * ! env replace
 * 		| if (process.env.NODE_ENV !== 'development') {
 * 		|   return 'not so fast';
 * 		| }
 * 		| const isExactMatch = (str, match) => {
 * 		|   const escapeRegExpMatch = match.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
 * 		|   return new RegExp(`\\b${escapeRegExpMatch}\\b`).test(str);
 * 		| };
 * 		| const automatePath = path.join(__dirname, '../../.env');
 * 		| const file = fs.readFileSync(automatePath);
 * 		| const textArr = file.toString().split('\n');
 * 		| // search for keys and values
 * 		| // const key1 = 'MUST_BE_REPLACED';
 * 		| // const value1 = '123';
 * 		| const keyvals = [
 * 		|   {
 * 		|     key: 'MUST_BE_REPLACED1',
 * 		|     value: 'RGAPI-0632c76c-256e-49be-a50a-f2bd54d6849a',
 * 		|   },
 * 		|   {
 * 		|     key: 'MUST_BE_REPLACED2',
 * 		|     value: 'RGAPI-0632c76c-256e-49be-a50a-f2bd54d6849a',
 * 		|   },
 * 		|   {
 * 		|     key: 'MUST_BE_REPLACED3',
 * 		|     value: 'RGAPI-0632c76c-256e-49be-a50a-f2bd54d6849a',
 * 		|   },
 * 		| ];
 * 		| keyvals.forEach((obj) => {
 * 		|   // replace with new value
 * 		|   let key1Index = textArr.findIndex((el) => isExactMatch(el, obj.key));
 *		|   if (key1Index === -1) {
 *		|     throw new Error();
 *		|   }
 *		|   let key1Value = textArr[key1Index]; // key and value joined e.g. key=value
 *		|   let key1Arr = key1Value.split('=');
 *		|   key1Arr[1] = obj.value;
 *		|   key1Value = key1Arr.join('='); // new key and value joined e.g. key=new_value
 *		|   textArr[key1Index] = key1Value;
 *		| });
 *		| const finalFileString = textArr.join('\n');
 *		| try {
 *		|   fs.writeFileSync(automatePath, finalFileString, 'utf8');
 *		|   return {
 *		|     msg: 'replaced',
 *		|   };
 *		| } catch (error) {
 *		|   console.log(error);
 *		|   throw new Error();
 *		| }
 */

import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { SeederProvider } from './seeder.provider';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);

  try {
    await app.select(SeederModule).get(SeederProvider).run();
  } catch (error) {
    await app.close();
  }

  await app.close();
}

bootstrap();

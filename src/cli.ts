import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { CommandsModule } from './commands/commands.module';

/**
 * some user commands (for help)
 * yarn nestjs-command create:user --help
 * yarn nestjs-command create:user yoda --group jedi --saber
 * yarn nestjs-command create:user anakin --group jedi --no-saber
 */

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CommandsModule);

  try {
    await app.select(CommandModule).get(CommandService).exec();
  } catch (error) {
    console.log('error occured');
    console.error(error);
    await app.close();
  }

  await app.close();
}

bootstrap();

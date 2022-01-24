import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandModule } from 'nestjs-command';
import { EntitiesModule } from 'src/app/modules/entities.module';
import { TypeormConfig } from 'src/configs/typeorm';
import { GeneralCommand } from './general/general.command';
import { SeedUserCommand } from './seed/seed_users.command';

@Module({
    imports: [
        EntitiesModule,
        CommandModule,
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot(TypeormConfig.instance),
    ],
    controllers: [],
    providers: [GeneralCommand, SeedUserCommand],
})
export class CommandsModule {}

import { TestService } from './services/test_service/test_service.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandModule } from 'nestjs-command';
import { SeederProvider } from './seeder.provider';
import { TypeormConfig } from '../../configs/typeorm';

@Module({
  imports: [CommandModule, ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forRoot(TypeormConfig.instance)],
  controllers: [],
  providers: [SeederProvider, TestService],
})
export class SeederModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandModule } from 'nestjs-command';
import { configService } from '../../config.service';
import { SeederProvider } from './seeder.provider';
import { TestService } from './services/test_service/test_service.service';

@Module({
  imports: [
    CommandModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
  ],
  controllers: [],
  providers: [SeederProvider, TestService],
})
export class SeederModule {}

import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SeederController } from './seeder.controller';
import User from '../entity/user.entity';
import UserDetails from '../entity/user_details.entity';

//TODO gadacvale es stili da gamoiyene es https://www.npmjs.com/package/nestjs-seeder

@Module({
  imports: [TypeOrmModule.forFeature([User, UserDetails, MatchingSpams])],
  controllers: [SeederController],
  providers: [],
  exports: [],
})
export class SeederModule {}

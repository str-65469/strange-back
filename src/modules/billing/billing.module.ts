import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperlikeServicesService } from 'src/app/core/superlike/superlike.service';
import { SuperLikeServices } from 'src/database/entity/superlike_services.entity';
import { UsersModule } from '../user/users.module';
import { SuperLikeBillingController } from './controllers/superlikebilling.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SuperLikeServices]), UsersModule],
  controllers: [SuperLikeBillingController],
  providers: [SuperlikeServicesService],
})
export class BillingModule {}

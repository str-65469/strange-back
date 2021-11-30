import { Module } from '@nestjs/common';
import { SuperLikeBillingController } from '../../app/controllers/superlikebilling.controller';
import { SuperlikeService } from 'src/app/core/superlike/superlike.service';
import { SuperLikeServices } from 'src/database/entity/superlike_services.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../user/users.module';
import { SuperLikePayment } from 'src/database/entity/superlike_payment.entity';
import { SuperlikePaymentService } from 'src/app/core/superlike/superlike_payment.service';
import { PaypalPaymentDetailsService } from 'src/app/core/paypal_payment_details/paypal_payment_details.service';
import { PaypalPaymentDetails } from 'src/database/entity/paypal_payment_details.entity';
import { UserBelongingsService } from 'src/app/core/user_belongings/user_belongings.service';
import { UserBelongings } from 'src/database/entity/user_belongings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SuperLikeServices, SuperLikePayment, PaypalPaymentDetails, UserBelongings]), UsersModule],
  controllers: [SuperLikeBillingController],
  providers: [SuperlikeService, SuperlikePaymentService, PaypalPaymentDetailsService, UserBelongingsService],
})
export class BillingModule {}

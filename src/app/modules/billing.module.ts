import { Module } from '@nestjs/common';
import { SuperLikeBillingController } from '../controllers/superlike_billing.controller';
import { SuperlikeService } from 'src/app/services/core/superlike/superlike.service';
import { SuperLikeServices } from 'src/database/entity/superlike_services.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users.module';
import { SuperLikePayment } from 'src/database/entity/superlike_payment.entity';
import { SuperlikePaymentService } from 'src/app/services/core/superlike/superlike_payment.service';
import { PaypalPaymentDetails } from 'src/database/entity/paypal_payment_details.entity';
import { UserBelongingsService } from 'src/app/services/core/user/user_belongings.service';
import { UserBelongings } from 'src/database/entity/user_belongings.entity';
import { PaypalPaymentDetailsService } from '../services/core/paypal_payment_details.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SuperLikeServices, SuperLikePayment, PaypalPaymentDetails, UserBelongings]),
    UsersModule,
  ],
  controllers: [SuperLikeBillingController],
  providers: [SuperlikeService, SuperlikePaymentService, PaypalPaymentDetailsService, UserBelongingsService],
})
export class BillingModule {}

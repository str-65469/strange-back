import { Module } from '@nestjs/common';
import { SuperLikeBillingController } from '../controllers/superlike_billing.controller';
import { SuperlikeService } from 'src/app/services/core/superlike/superlike.service';
import { UsersModule } from './users.module';
import { SuperlikePaymentService } from 'src/app/services/core/superlike/superlike_payment.service';
import { UserBelongingsService } from 'src/app/services/core/user/user_belongings.service';
import { PaypalPaymentDetailsService } from '../services/core/paypal_payment_details.service';
import { EntitiesModule } from './entities.module';

@Module({
  imports: [EntitiesModule, UsersModule],
  controllers: [SuperLikeBillingController],
  providers: [
    SuperlikeService,
    SuperlikePaymentService,
    PaypalPaymentDetailsService,
    UserBelongingsService,
  ],
})
export class BillingModule {}

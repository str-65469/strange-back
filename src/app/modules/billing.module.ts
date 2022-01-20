import { Module } from '@nestjs/common';
import { SuperLikeBillingController } from '../controllers/superlike_billing.controller';
import { SuperlikeService } from 'src/app/modules/user/superlike.service';
import { UsersModule } from './users.module';
import { SuperlikePaymentService } from 'src/app/modules/user/superlike_payment.service';
import { UserBelongingsService } from 'src/app/modules/user/user_belongings.service';
import { PaypalPaymentDetailsService } from './billing/paypal_payment_details.service';
import { EntitiesModule } from './entities.module';

@Module({
    imports: [EntitiesModule, UsersModule],
    controllers: [SuperLikeBillingController],
    providers: [SuperlikeService, SuperlikePaymentService, PaypalPaymentDetailsService, UserBelongingsService],
})
export class BillingModule {}

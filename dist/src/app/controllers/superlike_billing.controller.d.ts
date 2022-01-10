import { Request } from 'express';
import { PaypalPaymentDetailsService } from '../services/core/paypal_payment_details.service';
import { SuperlikeService } from 'src/app/services/core/superlike/superlike.service';
import { SuperLikeServiceType } from 'src/app/common/enum/superlike_services';
import { SuperlikePaymentService } from '../services/core/superlike/superlike_payment.service';
import { UserBelongingsService } from '../services/core/user/user_belongings.service';
import { UsersService } from '../services/core/user/users.service';
export declare class SuperLikeBillingController {
    private readonly userService;
    private readonly superLikeService;
    private readonly superlikePaymentService;
    private readonly paypalPaymentDetailsService;
    private readonly userBelongingsService;
    constructor(userService: UsersService, superLikeService: SuperlikeService, superlikePaymentService: SuperlikePaymentService, paypalPaymentDetailsService: PaypalPaymentDetailsService, userBelongingsService: UserBelongingsService);
    createOrder(type: SuperLikeServiceType): Promise<{
        order: any;
        id: any;
    }>;
    captureOrder(orderId: string, type: SuperLikeServiceType, req: Request): Promise<{
        msg: string;
    }>;
}

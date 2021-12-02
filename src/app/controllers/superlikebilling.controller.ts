import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { PaypalPaymentDetailsService } from '../core/paypal_payment_details/paypal_payment_details.service';
import { SuperlikeService } from 'src/app/core/superlike/superlike.service';
import { SuperLikeServiceType } from 'src/app/enum/superlike_services';
import { JwtAcessTokenAuthGuard } from 'src/modules/auth/guards/jwt-access.guard';
import { SuperlikePaymentService } from '../core/superlike/superlike_payment.service';
import { PaymentType } from '../enum/payment_type.enum';
import { UsersService } from 'src/modules/user/services/users.service';
import { Request } from 'express';
import * as paypal from '@paypal/checkout-server-sdk';
import { UserBelongingsService } from '../core/user_belongings/user_belongings.service';

import * as dotenv from 'dotenv';

dotenv.config();

@UseGuards(JwtAcessTokenAuthGuard)
@Controller('superlike')
export class SuperLikeBillingController {
  constructor(
    private readonly userService: UsersService,
    private readonly superLikeService: SuperlikeService,
    private readonly superlikePaymentService: SuperlikePaymentService,
    private readonly paypalPaymentDetailsService: PaypalPaymentDetailsService,
    private readonly userBelongingsService: UserBelongingsService,
  ) {}

  @Get('paypal/create-order/:type')
  public async createOrder(@Param('type', ParseIntPipe) type: SuperLikeServiceType) {
    const packet = await this.superLikeService.findByType(type);

    console.log(process.env.NODE_ENV);
    console.log(process.env.PAYPAL_CLIENT_ID);
    console.log(process.env.PAYPAL_SECRET_ID);

    const Enviroment = process.env.NODE_ENV === 'production' ? paypal.core.LiveEnvironment : paypal.core.SandboxEnvironment;

    const paypalClient = new paypal.core.PayPalHttpClient(
      new Enviroment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET_ID),
    );

    const request = new paypal.orders.OrdersCreateRequest();

    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: packet.price,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: packet.price,
              },
            },
          },
        },
      ],
    });

    try {
      const order = await paypalClient.execute(request);

      console.log('================================= created');
      console.log(order);

      return {
        order,
        id: order.result.id,
      };
    } catch (error) {
      console.log(error);

      throw new HttpException('something went wrong', HttpStatus.EXPECTATION_FAILED);
    }
  }

  @Get('paypal/capture-order/:orderId/:type')
  public async captureOrder(
    @Param('orderId') orderId: string,
    @Param('type', ParseIntPipe) type: SuperLikeServiceType,
    @Req() req: Request,
  ) {
    const userId = await this.userService.userID(req);
    const packet = await this.superLikeService.findByType(type);

    const Enviroment = process.env.NODE_ENV === 'production' ? paypal.core.LiveEnvironment : paypal.core.SandboxEnvironment;
    const paypalClient = new paypal.core.PayPalHttpClient(
      new Enviroment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET_ID),
    );

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    console.log('starting');

    try {
      const capture = await paypalClient.execute(request);

      console.log('================================= captured');
      console.log(capture);

      const captureID = capture?.result?.purchase_units[0]?.payments?.captures[0]?.id;

      const savedPaypalPaymentDetail = await this.paypalPaymentDetailsService.save(userId, captureID, capture); // save capture id
      const increasedSuperLike = await this.userBelongingsService.update(userId, packet.amount); // increase superlike for user

      // save payment detail
      const savedPaymentDetail = await this.superlikePaymentService.create({
        amount: packet.amount,
        like_service_type: type,
        payment_type: PaymentType.PAYPAL,
        userId,
      });

      return {
        msg: 'successfull payment',
        savedPaypalPaymentDetail,
        savedPaymentDetail,
        increasedSuperLike,
      };
    } catch (error) {
      console.log(error);

      throw new HttpException('something went wrong', HttpStatus.EXPECTATION_FAILED);
    }
  }
}

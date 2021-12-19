import * as paypal from '@paypal/checkout-server-sdk';
import { Request } from 'express';
import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { PaypalPaymentDetailsService } from '../services/core/paypal_payment_details.service';
import { SuperlikeService } from 'src/app/services/core/superlike/superlike.service';
import { SuperLikeServiceType } from 'src/app/common/enum/superlike_services';
import { JwtAcessTokenAuthGuard } from 'src/app/security/auth/jwt_access.guard';
import { PaymentType } from '../common/enum/payment_type.enum';
import { SuperlikePaymentService } from '../services/core/superlike/superlike_payment.service';
import { UserBelongingsService } from '../services/core/user/user_belongings.service';
import { UsersService } from '../services/core/user/users.service';

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

      throw new HttpException(
        {
          error,
          msg: 'something went wrong',
        },
        HttpStatus.EXPECTATION_FAILED,
      );
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

      // save capture id, increase superlike for user, save payment detail
      await this.paypalPaymentDetailsService.save(userId, captureID, capture);
      await this.userBelongingsService.update(userId, packet.amount);
      await this.superlikePaymentService.create(packet.amount, type, PaymentType.PAYPAL, userId);

      return { msg: 'successfull payment' };
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          error,
          msg: 'something went wrong',
        },
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }
}

import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { SuperlikeServicesService } from 'src/app/core/superlike/superlike.service';
import * as paypal from '@paypal/checkout-server-sdk';
import { SuperLikeServiceType } from 'src/app/enum/superlike_services';

@Controller('superlike')
export class SuperLikeBillingController {
  constructor(private readonly superLikeService: SuperlikeServicesService) {}

  @Get('paypal/create-order/:type')
  public async createOrder(@Param('type', ParseIntPipe) type: SuperLikeServiceType) {
    const packet = await this.superLikeService.findByType(type);

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
      console.log('=================================');
      console.log(order);

      return {
        id: order.result.id,
      };
    } catch (error) {
      throw new HttpException('something went wrong', HttpStatus.EXPECTATION_FAILED);
    }
  }
}

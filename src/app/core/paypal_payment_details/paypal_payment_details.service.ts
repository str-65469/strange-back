import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaypalPaymentDetails } from 'src/database/entity/paypal_payment_details.entity';

Injectable();
export class PaypalPaymentDetailsService {
  constructor(
    @InjectRepository(PaypalPaymentDetails)
    private readonly paypalPaymentDetailsRepo: Repository<PaypalPaymentDetails>,
  ) {}

  save(userId: number, captureId: string, paymentJson: string): Promise<PaypalPaymentDetails> {
    const paypalPaymentDetail = this.paypalPaymentDetailsRepo.create({
      captureId,
      userId,
      paymentJson,
    });

    return this.paypalPaymentDetailsRepo.save(paypalPaymentDetail);
  }
}

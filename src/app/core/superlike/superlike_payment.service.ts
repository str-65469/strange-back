import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuperLikePayment } from 'src/database/entity/superlike_payment.entity';
import { SuperlikePaymentCreateProps } from './props/superlike.prop';

Injectable();
export class SuperlikePaymentService {
  constructor(
    @InjectRepository(SuperLikePayment)
    private readonly superlikePaymentRepo: Repository<SuperLikePayment>,
  ) {}

  create(props: SuperlikePaymentCreateProps): Promise<SuperLikePayment> {
    const { amount, like_service_type, payment_type, userId } = props;

    const superLikePayment = this.superlikePaymentRepo.create({
      amount,
      userId,
      like_service_type,
      payment_type,
    });

    return this.superlikePaymentRepo.save(superLikePayment);
  }
}

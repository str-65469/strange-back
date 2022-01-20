import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuperLikePayment } from 'src/database/entity/superlike_payment.entity';
import { PaymentType } from 'src/app/common/enum/payment_type.enum';
import { SuperLikeServiceType } from 'src/app/common/enum/superlike_services';

Injectable();
export class SuperlikePaymentService {
    constructor(
        @InjectRepository(SuperLikePayment)
        private readonly superlikePaymentRepo: Repository<SuperLikePayment>,
    ) {}

    create(
        amount: number,
        like_service_type: SuperLikeServiceType,
        payment_type: PaymentType,
        userId: number,
    ): Promise<SuperLikePayment> {
        const superLikePayment = this.superlikePaymentRepo.create({
            amount,
            userId,
            like_service_type,
            payment_type,
        });

        return this.superlikePaymentRepo.save(superLikePayment);
    }
}

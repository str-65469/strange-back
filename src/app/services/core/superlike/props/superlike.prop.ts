import { PaymentType } from 'src/app/enum/payment_type.enum';
import { SuperLikeServiceType } from 'src/app/enum/superlike_services';

export interface SuperlikePaymentCreateProps {
  amount: number;
  like_service_type: SuperLikeServiceType;
  payment_type: PaymentType;
  userId: number;
}

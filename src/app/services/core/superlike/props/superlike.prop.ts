import { PaymentType } from 'src/app/common/enum/payment_type.enum';
import { SuperLikeServiceType } from 'src/app/common/enum/superlike_services';

export interface SuperlikePaymentCreateProps {
  amount: number;
  like_service_type: SuperLikeServiceType;
  payment_type: PaymentType;
  userId: number;
}

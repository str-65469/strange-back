import User from 'src/database/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AccountAbuseReport } from 'src/database/entity/account_abuse_reports.entity';
import { ContactUs } from 'src/database/entity/contact_us.entity';
import { ForgotPasswordCache } from 'src/database/entity/forgot_password_cache.entity';
import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { PaypalPaymentDetails } from 'src/database/entity/paypal_payment_details.entity';
import { SuperLikePayment } from 'src/database/entity/superlike_payment.entity';
import { SuperLikeServices } from 'src/database/entity/superlike_services.entity';
import { UserBelongings } from 'src/database/entity/user_belongings.entity';
import { UserDetails } from 'src/database/entity/user_details.entity';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { ChatHeadRepository } from '../repositories/chat_head.repository';
import { ChatMessagesRepository } from '../repositories/chat_messages.repository';
import { ChatParticipantsRepository } from '../repositories/chat_participant.repositry';
import {UserRepository} from "../repositories/user_repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // user
      User, //TODO replace all soon !!!
      UserRepository,
      UserDetails,
      UserBelongings,
      UserRegisterCache,

      // duo finder
      MatchedDuos,
      MatchingLobby,
      MatchedDuosNotifications,
      MatchingSpams,

      // chat
      ChatParticipantsRepository,
      ChatMessagesRepository,
      ChatHeadRepository,

      // billing
      SuperLikeServices,
      SuperLikePayment,
      PaypalPaymentDetails,

      // other
      ContactUs,
      AccountAbuseReport,
      ForgotPasswordCache,
    ]),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}

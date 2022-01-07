import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from '../controllers/chat.controller';
import { ChatMessagesRepository } from '../repositories/chat_messages.repository';
import { ChatParticipantsRepository } from '../repositories/chat_participant.repositry';
import { ChatService } from '../services/core/chat.service';
import { ChatMessagesService } from '../services/core/chat/chat_messages.service';
import { ChatParticipantsService } from '../services/core/chat/chat_participants.service';
import { SocketModule } from '../socket/socket.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    UsersModule,
    SocketModule,
    TypeOrmModule.forFeature([ChatParticipantsRepository, ChatMessagesRepository]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatParticipantsService, ChatMessagesService],
  exports: [],
})
export class ChatModule {}

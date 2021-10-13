import { Module } from '@nestjs/common';
import { UsersModule } from 'src/http/user/users.module';
import { DuoMatchGateway } from './duofinder/duofinder.gateway';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [DuoMatchGateway],
})
export class SocketModule {}

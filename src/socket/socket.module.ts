import { Module } from '@nestjs/common';
import { DuoMatchGateway } from './duofinder/duofinder.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [DuoMatchGateway],
})
export class SocketModule {}

import { Module } from '@nestjs/common';
import { NetworkProvider } from './network.provider';

@Module({
    imports: [],
    controllers: [],
    providers: [NetworkProvider],
    exports: [NetworkProvider],
})
export class NetworkModule {}

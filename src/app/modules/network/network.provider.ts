import { Injectable } from '@nestjs/common';
import { Axiosfit } from '@yggdrasilts/axiosfit';
import { LolRemoteService } from './services/lol_api.service';

@Injectable()
export class NetworkProvider {
    public lolRemoteService = new Axiosfit<LolRemoteService>()
        .baseUrl(process.env.LOL_API_URL)
        .create(LolRemoteService);
}

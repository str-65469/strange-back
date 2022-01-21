/* eslint-disable @typescript-eslint/no-unused-vars */
import { HTTP, GET, Path, Interceptors, AxiosResponse } from '@yggdrasilts/axiosfit';
import { LolServer } from 'src/app/common/enum/lol_server.enum';
import { SummonerDetailsResponse } from '../dto/response/summoner_details.response';
import { SummonerDetailsAndLeagueResponse } from '../dto/response/summoner_details_league.response';
import { LolApiInterceptor } from '../interceptor/lol_api.interceptor';

@HTTP('/api/proxy', { usePromises: true, enableAxiosLogger: process.env.NODE_ENV === 'development' })
@Interceptors(LolApiInterceptor)
export class LolRemoteService {
    @GET('/summoner/details-and-league/:server/:summonerName')
    public summonerNameDetailsAndLeague(
        @Path('server') _server: LolServer,
        @Path('summonerName') _summonerName: string,
    ): Promise<AxiosResponse<SummonerDetailsAndLeagueResponse>> {
        return null;
    }

    @GET('/summoner/details/:server/:summonerName')
    public summonerNameDetails(
        @Path('server') _server: LolServer,
        @Path('summonerName') _summonerName: string,
    ): Promise<AxiosResponse<SummonerDetailsResponse>> {
        return null;
    }
}

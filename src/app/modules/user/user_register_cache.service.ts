import { UserRegisterCache } from '../../../database/entity/user_register_cache.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LolServer } from 'src/app/common/enum/lol_server.enum';
import { SummonerDetailsAndLeagueResponse } from '../network/dto/response/summoner_details_league.response';
import { GeneralHelper } from 'src/app/utils/general.helper';
import { configs } from 'src/configs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserRegisterCacheService {
    constructor(
        @InjectRepository(UserRegisterCache)
        private readonly userRegisterCacheRepo: Repository<UserRegisterCache>,
    ) {}

    delete(id) {
        return this.userRegisterCacheRepo.delete(id);
    }

    findByEmailOrUsername(email: string, username: string) {
        return this.userRegisterCacheRepo.findOne({ where: [{ email }, { username }] });
    }

    findOne(id: number) {
        return this.userRegisterCacheRepo.findOne(id);
    }

    createFirstStepCache(server: LolServer, summonerName: string, summonerData: SummonerDetailsAndLeagueResponse) {
        const { startingTimeStamp, endingTimeStamp } = GeneralHelper.dater.addMinutes(
            configs.general.REGISTER_TIMESTAMP_DURATION,
        );

        const generatedUUID: string = uuid();
        const userRegisterCache = this.userRegisterCacheRepo.create({
            timestamp_now: startingTimeStamp,
            timestamp_end: endingTimeStamp,
            profile_icon_id: summonerData.profileIconId,
            is_valid: false,
            uuid: generatedUUID,

            server: server,
            summoner_name: summonerName,
            level: summonerData.summonerLevel,
            league: summonerData.league,
            league_number: summonerData.leagueNumber,
            win_rate: summonerData.winRatio,
            league_points: summonerData.leaguePoints,
        });

        return this.userRegisterCacheRepo.save(userRegisterCache);
    }

    findBySummonerAndServer(server: LolServer, summonerName: string) {
        return this.userRegisterCacheRepo.findOne({ where: { server, summoner_name: summonerName } });
    }
    findBySummonerAndServerAndUUID(server: LolServer, summonerName: string, uuid: string) {
        return this.userRegisterCacheRepo.findOne({ where: { server, summoner_name: summonerName, uuid } });
    }

    updateValidation(cacheId: number, bool: boolean) {
        return this.userRegisterCacheRepo.update(cacheId, {
            is_valid: bool,
        });
    }

    updateUserDetails(
        id: number,
        arg0: {
            email: string;
            username: string;
            password: string;
            secret_token: string;
            expiry_date: Date;
        },
    ) {
        return this.userRegisterCacheRepo.update(id, { ...arg0 });
    }
}

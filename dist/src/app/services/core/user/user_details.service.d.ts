import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { Repository } from 'typeorm';
import { UserDetails } from 'src/database/entity/user_details.entity';
import User from 'src/database/entity/user.entity';
import { LolServer } from 'src/app/common/enum/lol_server.enum';
export declare class UserDetailsServiceService {
    private readonly userDetailsRepo;
    constructor(userDetailsRepo: Repository<UserDetails>);
    findBySummonerAndServer(server: LolServer, summonerName: string): Promise<UserDetails>;
    saveUserDetailsByCachedData(userCached: UserRegisterCache, user: User): Promise<UserDetails>;
}

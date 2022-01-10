import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { Repository } from 'typeorm';
import User from 'src/database/entity/user.entity';
export declare class MatchedDuosService {
    private readonly matchedRepo;
    constructor(matchedRepo: Repository<MatchedDuos>);
    save(user: User, matchedUser: User): Promise<MatchedDuos>;
    get(user: User, lastId?: number): Promise<User[]>;
}

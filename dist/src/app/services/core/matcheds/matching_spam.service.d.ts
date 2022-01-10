import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { Repository } from 'typeorm';
import User from 'src/database/entity/user.entity';
interface FilterSpamProps {
    user: User;
    addedId: number;
    list: 'accept_list' | 'decline_list' | 'matched_list' | 'remove_list';
}
export declare class MatchingSpamService {
    private readonly spamRepo;
    constructor(spamRepo: Repository<MatchingSpams>);
    createEmptySpam(user: User): Promise<MatchingSpams>;
    update({ user, addedId, list }: FilterSpamProps, pop?: boolean): Promise<MatchingSpams>;
}
export {};

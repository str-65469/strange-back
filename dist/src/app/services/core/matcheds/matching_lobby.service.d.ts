import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { Repository } from 'typeorm';
import User from 'src/database/entity/user.entity';
export declare class MatchingLobbyService {
    private readonly lobbyRepo;
    constructor(lobbyRepo: Repository<MatchingLobby>);
    add(user: User, likedUser: User): Promise<MatchingLobby>;
    remove(user: User, likedUser: User): Promise<import("typeorm").DeleteResult>;
    checkIfBothInLobby(user: User): Promise<User[]>;
    userWaiting(user: User, likedUser: User): Promise<MatchingLobby>;
}

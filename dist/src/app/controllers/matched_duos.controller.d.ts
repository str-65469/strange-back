import { Request } from 'express';
import { MatchedDuosService } from '../services/core/matcheds/matched_duos.service';
import { UsersService } from '../services/core/user/users.service';
export declare class MatchedDuosController {
    private readonly matchedDuosService;
    private readonly userService;
    constructor(matchedDuosService: MatchedDuosService, userService: UsersService);
    getMatchedDuos(lastId: number | null, req: Request): Promise<import("../../database/entity/user.entity").default[]>;
}

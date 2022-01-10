import { Repository } from 'typeorm';
import { SuperLikeServices } from 'src/database/entity/superlike_services.entity';
import { SuperLikeServiceType } from 'src/app/common/enum/superlike_services';
export declare class SuperlikeService {
    private readonly superlikeServicesRepo;
    constructor(superlikeServicesRepo: Repository<SuperLikeServices>);
    findByType(type: SuperLikeServiceType): Promise<SuperLikeServices>;
}

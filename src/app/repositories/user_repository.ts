import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../database/entity/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    updateOnlineStatus(id: number, bool: boolean) {
        return this.update(id, {
            is_online: bool,
        });
    }
}

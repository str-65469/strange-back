import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';

interface FilterSpamProps {
    user: User;
    addedId: number;
    list: 'accept_list' | 'decline_list' | 'matched_list' | 'remove_list';
}

@Injectable()
export class MatchingSpamService {
    constructor(
        @InjectRepository(MatchingSpams)
        private readonly spamRepo: Repository<MatchingSpams>,
    ) {}

    async createEmptySpam(user: User) {
        const spam = this.spamRepo.create({ user });

        return await this.spamRepo.save(spam);
    }

    async update({ user, addedId, list }: FilterSpamProps, pop?: boolean) {
        const spam = await this.spamRepo.findOne({ where: { user } });

        let newList = spam[list];

        // checking if not exists
        if (!spam[list].includes(addedId)) {
            newList = [...spam[list], addedId];
        }

        if (pop && list === 'decline_list') {
            const tempList = newList.slice();
            tempList.shift(); // remove first item from array (e.g. oldest)
            newList = tempList;
        }

        spam[list] = newList;

        return this.spamRepo.save(spam);
    }
    //   async update({ user, addedId, list }: FilterSpamProps) {
    //     const spam = await this.spamRepo.findOne({ where: { user } });
    //     let newList = [...spam[list], addedId];

    //     if (
    // 		(list === 'decline_list' && newList.length > 2) ||
    // 		(list === 'accept_list' && newList.length > 800) ||
    //       (list === 'matched_list' && newList.length > 300) ||
    //       (list === 'remove_list' && newList.length > 500)
    //     ) {
    //       const tempList = newList.slice();
    //       tempList.shift(); // remove oldest added item (e.g. first)
    //       newList = tempList;
    //     }

    //     spam[list] = newList;

    //     return await this.spamRepo.save(spam);
    //   }
}

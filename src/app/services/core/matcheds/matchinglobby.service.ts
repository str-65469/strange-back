import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { In, Repository } from 'typeorm';
import User from 'src/database/entity/user.entity';

@Injectable()
export class MatchingLobbyService {
  constructor(@InjectRepository(MatchingLobby) private readonly lobbyRepo: Repository<MatchingLobby>) {}

  async add(user: User, likedUser: User) {
    const lobby = await this.lobbyRepo.create({
      user,
      likedUser,
    });

    return await this.lobbyRepo.save(lobby);
  }

  async remove(user: User, likedUser: User) {
    return await this.lobbyRepo.delete({
      user,
      likedUser,
    });
  }

  async checkIfBothInLobby(user: User) {
    const mines = await this.lobbyRepo.find({ where: { user: user }, relations: ['user', 'likedUser'] });
    const oponentIds = mines.map((e) => e.likedUser.id);

    if (mines && mines.length) {
      // oponent who liked me
      return await this.lobbyRepo
        .find({
          where: {
            user: In(oponentIds),
            likedUser: user,
          },

          relations: ['user'],
        })
        .then((lobbies) => lobbies.map((l) => l.user));
    }

    return [];
  }

  public async userWaiting(user: User, likedUser: User) {
    return await this.lobbyRepo.findOne({
      where: {
        user,
        likedUser,
      },
    });
  }
}

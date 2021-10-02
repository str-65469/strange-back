import { LolServer } from './../../enum/lol_server.enum';
import { UserRegisterCache } from './../../database/entity/user_register_cache';
import { Injectable } from '@nestjs/common';
import User from 'src/database/entity/user.entity';
import { UserRegisterDto } from './dto/user-register.dto';

@Injectable()
export class UsersService {
  private readonly users: Array<User> = [
    {
      id: 1,
      username: 'giusha',
      email: 'gio@gio.com',
      password: 'giusha123',
      created_at: new Date(),
    },
    {
      id: 2,
      username: 'lelachka',
      email: 'lela@lela.com',
      password: 'lela123',
      created_at: new Date(),
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async checkLolCredentialsValid(server: LolServer, summoner_name: string): Promise<boolean> {
    // use api here

    return true;
  }

  async cacheUserRegister(body: UserRegisterDto) {
    const userCache = new UserRegisterCache(body);
    return await userCache.save();
  }
}

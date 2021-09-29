import { UserRegisterCache } from './../../database/entity/user_register_cache';
import { Injectable } from '@nestjs/common';
import User from 'src/database/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRegisterCache)
    private readonly userRegisterRepository: UserRegisterCache,
  ) {}

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
}

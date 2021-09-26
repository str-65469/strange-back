import { Injectable } from '@nestjs/common';

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users: Array<User> = [
    {
      id: 1,
      name: 'gio',
      username: 'giusha',
      email: 'gio@gio.com',
      password: 'giusha123',
    },
    {
      id: 2,
      name: 'lela',
      username: 'lelachka',
      email: 'lela@lela.com',
      password: 'lela123',
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}

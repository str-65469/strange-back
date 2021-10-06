import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import User from 'src/database/entity/user.entity';
// import { User } from './user.entity';

export const GetUser = createParamDecorator((_, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});

import * as jwt from 'jsonwebtoken';
import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtRegisterAuthGuard {
  constructor(
    @InjectRepository(UserRegisterCache)
    private readonly userRegisterCacheRepo: Repository<UserRegisterCache>,
  ) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // validate parameters
    ['id', 'secret'].forEach((param) => {
      if (!request.query[param]) {
        throw new HttpException(`query parameter {${param}} is missing`, HttpStatus.BAD_REQUEST);
      }
    });

    const { id, secret } = request.query;

    jwt.verify(secret, process.env.JWT_REGISTER_CACHE_SECRET, (err: jwt.VerifyErrors) => {
      if (err) {
        // clear cache with that id if err found on token
        this.userRegisterCacheRepo.delete(id);

        throw new HttpException(err, HttpStatus.UNAUTHORIZED);
      }
    });

    return true;
  }
}

import * as jwt from 'jsonwebtoken';
import { BadRequestException, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/app/services/core/auth/auth.service';

@Injectable()
export class JwtRegisterAuthGuard {
  constructor(
    @InjectRepository(UserRegisterCache) private readonly userRegisterCacheRepo: Repository<UserRegisterCache>,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // validate parameters
    ['id', 'secret'].forEach((param) => {
      if (!request.query[param]) {
        throw new BadRequestException(`query parameter {${param}} is missing`);
      }
    });

    const { id, secret } = request.query;

    console.log('===');
    console.log(id);
    console.log(secret);

    // first check if in register cache
    const cachedData = await this.authService.retrieveCachedData(id);

    // if secret and cached secret is not exactly same
    if (secret !== cachedData.secret_token) {
      throw new UnauthorizedException('Invalid token');
    }

    console.log('===');
    console.log(cachedData.id);
    console.log(cachedData.secret_token);
    console.log('===');

    jwt.verify(secret, process.env.JWT_REGISTER_CACHE_SECRET, (err: jwt.VerifyErrors) => {
      if (err) {
        console.log(err);

        // clear cache with that id if err found on token
        this.userRegisterCacheRepo.delete(id);

        throw new UnauthorizedException(err);
      }
    });

    return true;
  }
}

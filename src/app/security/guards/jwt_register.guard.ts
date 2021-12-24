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

    // first check if in register cache
    const cachedData = await this.authService.retrieveRegisterCachedData(id);

    // if secret and cached secret is not exactly same
    if (secret !== cachedData.secret_token) {
      throw new UnauthorizedException('Invalid token');
    }

    // remove cached data if expired only
    jwt.verify(secret, process.env.JWT_REGISTER_CACHE_SECRET, (err: jwt.VerifyErrors) => {
      if (err) {
        // clear cache with that id if err found on token
        this.userRegisterCacheRepo.delete(id);

        throw new UnauthorizedException(err);
      }
    });

    return true;
  }
}

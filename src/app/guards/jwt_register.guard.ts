import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { UserRegisterCacheService } from 'src/app/modules/user/user_register_cache.service';
import { JwtAcessService } from 'src/app/modules/common_services/jwt_access.service';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { GenericException } from 'src/app/common/exceptions/general.exception';
import { ExceptionMessageCode } from 'src/app/common/enum/message_codes/exception_message_code.enum';

@Injectable()
export class JwtRegisterAuthGuard {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtAcessService: JwtAcessService,
    private readonly userRegisterCacheService: UserRegisterCacheService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // validate parameters
    ['id', 'secret'].forEach((param) => {
      if (!request.query[param]) {
        throw new GenericException(
          HttpStatus.BAD_REQUEST,
          ExceptionMessageCode.QUERY_PARAMETER_MISSING,
          `query parameter {${param}} is missing`,
        );
      }
    });

    const { id, secret } = request.query;

    // first check if in register cache
    const cachedData = await this.authService.retrieveRegisterCachedData(id);

    // if secret and cached secret is not exactly same
    if (secret !== cachedData.secret_token) {
      throw new GenericException(HttpStatus.UNAUTHORIZED, ExceptionMessageCode.TOKEN_MISMATCH_ERROR);
    }

    const jwtPayload = await this.jwtAcessService.validateToken({
      token: secret,
      secret: process.env.JWT_REGISTER_CACHE_SECRET,
      expired_clbck: () => this.userRegisterCacheService.delete(id),
    });

    return true;
  }
}

import * as jwt from 'jsonwebtoken';
import User from 'src/database/entity/user.entity';
import { RandomGenerator } from '../../utils/random_generator';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus, Injectable } from '@nestjs/common';
import { GeneralException } from 'src/app/common/exceptions/general.exception';
import { configs } from 'src/configs/config';
import { IncomingHttpHeaders } from 'http2';
import { ExceptionMessageCode } from 'src/app/common/enum/message_codes/exception_message_code.enum';

interface RefreshTokenResponse {
  secret: string;
  refreshToken: string;
}

interface ValidateAcessTokenProps {
  token: string;
  secret: string;
  clbck?: () => void;
  expired_clbck?: () => void;
}

export interface AccessTokenPayload {
  id: number;
  username: string;
  socket_id: string;
}

@Injectable()
export class JwtAcessService {
  constructor(public readonly jwtService: JwtService) {}

  public generateAccessToken(user: User | UserRegisterCache, socketId: string): string {
    const payload = {
      id: user.id,
      username: user.username,
      socket_id: socketId,
    };

    return this.jwtService.sign(payload, { expiresIn: configs.tokens.access_token.expires_in });
  }

  public generateRefreshToken(user: User | UserRegisterCache, userSecret?: string): RefreshTokenResponse {
    const secret = userSecret ?? RandomGenerator.randomString();
    const payload = { id: user.id, username: user.username };

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: configs.tokens.refresh_token.expires_in,
      secret,
    });

    return { secret, refreshToken };
  }

  public generateForgotPasswordToken(id: number) {
    const secret = RandomGenerator.randomString();
    const payload = { id };

    const token = this.jwtService.sign(payload, {
      expiresIn: configs.tokens.user_forgot_password,
      secret,
    });

    return { secret, token };
  }

  public async validateToken(params: ValidateAcessTokenProps): Promise<boolean> {
    await jwt.verify(params.token, params.secret, async (err: jwt.VerifyErrors) => {
      // expired
      if (err instanceof jwt.TokenExpiredError) {
        if (params?.expired_clbck) await params?.clbck();
        throw new GeneralException(HttpStatus.UNAUTHORIZED, ExceptionMessageCode.TOKEN_EXPIRED_ERROR, err.message);
      }

      // general
      if (err instanceof jwt.JsonWebTokenError) {
        throw new GeneralException(HttpStatus.UNAUTHORIZED, ExceptionMessageCode.TOKEN_ERROR, err.message);
      }

      if (params?.clbck) await params?.clbck();
    });

    return true;
  }

  public getForgotPasswordToken(headers: IncomingHttpHeaders): string | null {
    const tokenString = headers['Authorization'] || headers['authorization'] || null;

    if (!tokenString || Array.isArray(tokenString)) {
      return null;
    }

    return tokenString.split(' ')[1];
  }
}

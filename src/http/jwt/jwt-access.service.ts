import { RandomGenerator } from './../../helpers/random_generator';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus, Injectable } from '@nestjs/common';
import User from 'src/database/entity/user.entity';
import { MessageCode } from 'src/enum/exceptions/general_exception.enum';
import { GeneralException } from 'src/exceptions/general.exception';
import { configs } from 'src/configs';
import * as jwt from 'jsonwebtoken';

export interface RefreshTokenResponse {
  secret: string;
  refreshToken: string;
}

interface ValidateAcessTokenProps {
  token: string;
  secret: string;
  expired_message?: string;
}

export interface AccessTokenPayload {
  id: number;
  username: string;
  socket_id: string;
}

@Injectable()
export class JwtAcessService {
  constructor(private readonly jwtService: JwtService) {}

  public generateAccessToken(user: User | UserRegisterCache, socketId: string): string {
    const payload = {
      id: user.id,
      username: user.username,
      socket_id: socketId,
    };

    return this.jwtService.sign(payload, {
      expiresIn: configs.tokens.access_token.expires_in,
    });
  }

  public generateRefreshToken(user: User | UserRegisterCache): RefreshTokenResponse {
    const secret = RandomGenerator.randomString();
    const payload = { id: user.id, username: user.username };

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: configs.tokens.refresh_token.expires_in,
      secret,
    });

    return { secret, refreshToken };
  }

  public validateToken(params: ValidateAcessTokenProps): boolean {
    jwt.verify(params.token, params.secret, (err: jwt.VerifyErrors) => {
      if (err) {
        if (err.name === MessageCode.TOKEN_EXPIRED) {
          throw new GeneralException(HttpStatus.UNAUTHORIZED, {
            message: params?.expired_message ?? configs.messages.exceptions.generalTokenExpired,
            status_code: HttpStatus.UNAUTHORIZED,
            message_code: MessageCode.TOKEN_EXPIRED,
            detailed: err,
          });
        }

        throw new GeneralException(HttpStatus.UNAUTHORIZED, {
          message: err.message,
          status_code: HttpStatus.UNAUTHORIZED,
          message_code: MessageCode.GENERAL,
          detailed: err,
        });
      }
    });

    return true;
  }
}

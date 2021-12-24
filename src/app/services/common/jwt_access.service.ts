import * as jwt from 'jsonwebtoken';
import User from 'src/database/entity/user.entity';
import { RandomGenerator } from '../../utils/random_generator';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { JwtService } from '@nestjs/jwt';
import { Header, HttpStatus, Injectable } from '@nestjs/common';
import { MessageCode } from 'src/app/common/enum/exceptions/general_exception.enum';
import { GeneralException } from 'src/app/common/exceptions/general.exception';
import { configs } from 'src/configs/config';
import { IncomingHttpHeaders } from 'http2';

interface RefreshTokenResponse {
  secret: string;
  refreshToken: string;
}

interface ValidateAcessTokenProps {
  token: string;
  secret: string;
  expired_message?: string;
  expired_clbck?: () => void;
  other_clbck?: () => void;
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

  public async validateToken(params: ValidateAcessTokenProps) {
    await jwt.verify(params.token, params.secret, async (err: jwt.VerifyErrors) => {
      if (err) {
        console.log('===============1');

        if (err.name === MessageCode.TOKEN_EXPIRED) {
          console.log('===============2');
          if (params.expired_clbck) {
            await params.expired_clbck();
          }

          console.log('==============3');

          throw new GeneralException(HttpStatus.UNAUTHORIZED, {
            message: params?.expired_message ?? configs.messages.exceptions.generalTokenExpired,
            status_code: HttpStatus.UNAUTHORIZED,
            message_code: MessageCode.TOKEN_EXPIRED,
            detailed: err,
          });
        }

        console.log('===============4');

        if (params.other_clbck) {
          await params.other_clbck();
        }

        console.log('===============5');

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

  public getForgotPasswordToken(headers: IncomingHttpHeaders): string | null {
    const tokenString = headers['Authorization'] || headers['authorization'] || null;

    if (!tokenString || Array.isArray(tokenString)) {
      return null;
    }

    return tokenString.split(' ')[1];
  }
}

import { RandomGenerator } from './../../helpers/random_generator';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus, Injectable } from '@nestjs/common';
import User from 'src/database/entity/user.entity';
import * as jwt from 'jsonwebtoken';
import { MessageCode } from 'src/enum/exceptions/general_exception.enum';
import { GeneralException } from 'src/exceptions/general.exception';
import { messages } from 'src/configs/messages';

export interface RefreshTokenResponse {
  secret: string;
  refreshToken: string;
}

@Injectable()
export class JwtAcessService {
  constructor(private readonly jwtService: JwtService) {}

  public generateAccessToken(user: User | UserRegisterCache): string {
    const payload = {
      id: user.id,
      username: user.username,
    };

    return this.jwtService.sign(payload, { expiresIn: '30s' });
    // return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  public generateRefreshToken(user: User | UserRegisterCache): RefreshTokenResponse {
    const payload = {
      id: user.id,
      username: user.username,
    };

    const secret = RandomGenerator.randomString();
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '1m', secret });

    return { secret, refreshToken };
  }

  public validateAcessToken(token): boolean {
    jwt.verify(token, process.env.JWT_SECRET, (err: jwt.VerifyErrors) => {
      if (err) {
        if (err.name === MessageCode.TOKEN_EXPIRED) {
          throw new GeneralException(
            {
              message: messages.exceptions.accessTokenExpired,
              status_code: HttpStatus.UNAUTHORIZED,
              message_code: MessageCode.TOKEN_EXPIRED,
              detailed: err,
            },
            HttpStatus.UNAUTHORIZED,
          );
        }

        throw new GeneralException(
          {
            message: err.message,
            status_code: HttpStatus.UNAUTHORIZED,
            message_code: MessageCode.GENERAL,
            detailed: err,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    });

    return true;
  }
}

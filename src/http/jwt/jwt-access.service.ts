import { RandomGenerator } from './../../helpers/random_generator';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import User from 'src/database/entity/user.entity';

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
}

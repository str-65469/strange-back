import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import User from 'src/database/entity/user.entity';
import crypto from 'crypto';

@Injectable()
export class JwtAcessService {
  constructor(private readonly jwtService: JwtService) {}

  public generateAccessToken(user: User | UserRegisterCache): string {
    const payload = {
      username: user.username,
      sub: user.id,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '30s' });
    // const token = this.jwtService.sign(payload, { expiresIn: '15m', secret: process.env.JWT_SECRET });

    return token;
  }

  public generateRefreshToken(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
    };

    const secret = crypto.randomBytes(20).toString('hex');
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '1m', secret });
    // const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d', secret });

    return { secret, refreshToken };
  }
}

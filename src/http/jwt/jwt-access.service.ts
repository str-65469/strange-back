import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import User from 'src/database/entity/user.entity';

@Injectable()
export class JwtAcessService {
  constructor(private readonly jwtService: JwtService) {}

  public generateAccessToken(user: User): string {
    const payload = {
      username: user.username,
      sub: user.id,
    };

    return this.jwtService.sign(payload);
  }

  public generateRefreshToken(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
    };

    return this.jwtService.sign(payload);
  }
}

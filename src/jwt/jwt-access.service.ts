import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { SafeUserLogin } from 'src/user/dto/user-login.dto';

@Injectable()
export class JwtAcessService {
  constructor(private readonly jwtService: JwtService) {}

  public generateToken(user: SafeUserLogin): string {
    const payload = {
      username: user.username,
      sub: user.id,
    };

    return this.jwtService.sign(payload);
  }
}

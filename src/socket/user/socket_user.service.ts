import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

import { AccessTokenPayload, JwtAcessService } from 'src/http/jwt/jwt-access.service';
import * as cookie from 'cookie';
import { JwtService } from '@nestjs/jwt';
import User from 'src/database/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SocketUserService {
  constructor(
    private readonly jwtAccessService: JwtAcessService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User | undefined> {
    return this.userRepo.findOne(id);
  }

  getUserPayload(socket: Socket): AccessTokenPayload {
    const headerCookies = socket.handshake.headers.cookie;
    const cookies = cookie.parse(headerCookies);
    const token = cookies?.access_token;
    this.jwtAccessService.validateToken({ token, secret: process.env.JWT_SECRET });

    const accessTokenDecoded = this.jwtService.decode(token) as AccessTokenPayload;

    return accessTokenDecoded;
  }
}

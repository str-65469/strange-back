import { JwtStrategy } from './../strategies/jwt.strategy';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JwtStrategy.AUTH_GUARD_STRATEGY) {}

import { JwtStrategy } from './../strategies/jwt.strategy';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JwtStrategy.AUTH_GUARD_STRATEGY) {}

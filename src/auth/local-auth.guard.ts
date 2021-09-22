import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Injectable()
export class LocalAuthGuard extends AuthGuard(LocalStrategy.AUTH_GUARD_STRATEGY) {}

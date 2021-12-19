import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAcessService } from '../../services/common/jwt-access.service';
import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../services/core/auth/auth.service';
import { UsersModule } from '../user/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { UserDetails } from 'src/database/entity/user_details.entity';
import { UserBelongingsService } from 'src/app/services/core/user/user_belongings.service';
import { UserBelongings } from 'src/database/entity/user_belongings.entity';
import { MatchingSpamService } from 'src/app/services/core/matcheds/matchingspamservice.service';
import { UserDetailsServiceService } from 'src/app/services/core/user/user_details.service';
import { UserRegisterCacheService } from 'src/app/services/core/user/user_register_cache.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    TypeOrmModule.forFeature([UserRegisterCache, UserDetails, MatchingSpams, UserBelongings]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAcessService,
    UserDetailsServiceService,
    UserRegisterCacheService,
    MatchingSpamService,
    UserBelongingsService,
  ],
  exports: [AuthService, JwtAcessService],
})
export class AuthModule {}

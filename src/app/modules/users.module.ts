import { JwtAcessService } from '../common/services/jwt_access.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { UserFileController } from '../controllers/user_files.controller';
import { MailModule } from 'src/app/modules/mail.module';
import { CookieService } from 'src/app/common/services/cookie.service';
import { MatchingSpamService } from 'src/app/modules/user/matching_spam.service';
import { UserController } from 'src/app/controllers/user.controller';
import { UsersService } from 'src/app/modules/user/users.service';
import { EntitiesModule } from './entities.module';
import { NetworkModule } from './network/network.module';

@Module({
    imports: [
        NetworkModule,
        MailModule,
        EntitiesModule,
        JwtModule.register({ secret: process.env.JWT_REGISTER_CACHE_SECRET }),
        MulterModule.register({ dest: './upload' }),
    ],
    controllers: [UserController, UserFileController],
    providers: [UsersService, JwtAcessService, CookieService, MatchingSpamService],
    exports: [UsersService, JwtAcessService, CookieService, MailModule, MatchingSpamService],
})
export class UsersModule {}

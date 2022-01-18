import {
    Controller,
    Post,
    Res,
    Body,
    Get,
    Query,
    ParseIntPipe,
    UseGuards,
    Req,
    UseFilters,
    HttpStatus,
} from '@nestjs/common';
import User from 'src/database/entity/user.entity';
import { v4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthService } from '../modules/auth/auth.service';
import { JwtAcessService } from '../common/services/jwt_access.service';
import { MailService } from 'src/app/modules/mail/mail.service';
import { JwtRegisterAuthGuard } from '../guards/jwt_register.guard';
import { JwtAcessTokenAuthGuard } from '../guards/jwt_access.guard';
import { UserBelongingsService } from 'src/app/modules/user/user_belongings.service';
import { CookieService } from 'src/app/common/services/cookie.service';
import { MatchingSpamService } from 'src/app/modules/user/matching_spam.service';
import { UserLoginDto } from '../schemas/request/user/user_login.dto';
import { UsersService } from '../modules/user/users.service';
import { UserDetailsServiceService } from '../modules/user/user_details.service';
import { UserRegisterCacheService } from '../modules/user/user_register_cache.service';
import { UserRegisterDto } from '../schemas/request/user/user_register.dto';
import { RegisterCacheExceptionFilter } from '../common/exception_filters/register_cache.excpetion.filter';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtRefreshTokenAuthGuard } from '../guards/jwt_refresh.guard';
import { ForgotPasswordRequest, JwtForgotPasswordAuthGuard } from '../guards/jwt_forgot_password.guard';
import { ForgotPasswordRequestDto } from '../schemas/request/forgot_password/forgot_password.dto';
import { ForgotPasswordConfirmRequestDto } from '../schemas/request/forgot_password/forgot_password_confirm.dto';
import { classToPlain } from 'class-transformer';
import { createUrl } from '../utils/url_builder.helper';
import { configs } from 'src/configs/config';
import { GenericException } from '../common/exceptions/general.exception';
import { ExceptionMessageCode } from '../common/enum/message_codes/exception_message_code.enum';
import { ForgotPasswordCache } from 'src/database/entity/forgot_password_cache.entity';
import { SummonerAuthRequest } from '../schemas/request/auth/summoner_auth.request';
import { LolAuthStatus } from '../common/enum/lol_auth_statuses.enum';
import { NetworkProvider } from '../modules/network/network.provider';
import { GeneralHelper } from '../utils/general.helper';
import { SecondStepAuthResponse } from '../modules/auth/response/second_step_auth.response';

@Controller('/auth')
export class AuthController {
    constructor(
        private readonly cookieService: CookieService,
        private readonly authService: AuthService,
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly jwtAcessService: JwtAcessService,
        private readonly mailServie: MailService,
        private readonly userDetailsService: UserDetailsServiceService,
        private readonly userRegisterCacheService: UserRegisterCacheService,
        private readonly matchingSpamService: MatchingSpamService,
        private readonly userBelongingsService: UserBelongingsService,
        private readonly networkProvider: NetworkProvider,
    ) {}

    @UseGuards(ThrottlerGuard)
    @Throttle(configs.general.AUTH_GENERAL_THROTTLE)
    @Post('/login')
    async login(@Body() body: UserLoginDto, @Res() res: Response) {
        this.cookieService.clearCookie(res);

        const user = await this.authService.validateUser(body);
        const accessToken = this.jwtAcessService.generateAccessToken(user, user.socket_id);
        const { refreshToken } = this.jwtAcessService.generateRefreshToken(user, user.secret);

        this.cookieService.createCookie(res, accessToken, refreshToken);

        return res.send(classToPlain(user));
    }

    @UseGuards(ThrottlerGuard)
    @Throttle(configs.general.AUTH_FIRST_STEP_THROTTLE)
    @Post('/register/step/1')
    async registerFirstStep(@Body() body: SummonerAuthRequest) {
        // timestamp check needed

        const { server, summonerName } = body;

        // check if summoner name and server exists in cache
        const summoner = await this.authService.retrieveRegisterCache(server, summonerName);

        // check if server and summoner_name is already in use in user details
        await this.authService.summonerNameAndServerExists(server, summonerName);

        // if exists delete and then renew, else create new and then return
        const userRegisteredCache = await this.authService.renewSummonerNameAndServer(
            summoner,
            server,
            summonerName,
        );

        return {
            uuid: userRegisteredCache.uuid,
        };
    }

    @UseGuards(ThrottlerGuard)
    @Throttle(configs.general.AUTH_GENERAL_THROTTLE)
    @Post('/register/step/2')
    async registerSecondStep(@Body() body: SummonerAuthRequest) {
        const { server, summonerName, uuid } = body;

        //! Big logic for checking cache
        // check if summoner name and server exists in cache
        //      true -> if exists then check first if is validated
        //              true -> return validated
        //
        //           -> fetch new data and check if profile icon id is changed
        //              true -> change validated to true
        //                   -> return validated
        //
        //           -> if time stamp is left
        //              true -> return left time
        //              false -> return timestamp invalid

        const secondStepAuthResponse = new SecondStepAuthResponse();

        const { userRegCache } = await this.authService.checkCacheAndValidation(server, summonerName, uuid);

        // if timestamp difference is more than 10 min
        const now = new Date();
        const differenceMin = GeneralHelper.dater.timeDifferenceMinutes(userRegCache.timestamp_now, now);

        if (differenceMin.min > configs.general.REGISTER_TIMESTAMP_DURATION) {
            secondStepAuthResponse.status = LolAuthStatus.INVALID_TIMESTAMP;
            return secondStepAuthResponse;
        }

        // fetch new data and check if profile icon id is changed
        const summonerOnlyDetails = await this.networkProvider.lolRemoteService.summonerNameDetails(
            server,
            summonerName,
        );

        if (userRegCache.profile_icon_id !== summonerOnlyDetails.profileIconId) {
            // change validate to true and return
            await this.userRegisterCacheService.updateValidation(userRegCache.id, true);

            secondStepAuthResponse.status = LolAuthStatus.IS_VALID;
            return secondStepAuthResponse;
        }

        secondStepAuthResponse.timeLeft = differenceMin;
        return secondStepAuthResponse;
    }

    @UseGuards(ThrottlerGuard)
    @Throttle(configs.general.AUTH_GENERAL_THROTTLE)
    @Post('/register/step/3')
    async register(@Body() body: UserRegisterDto) {
        const { email, summonerName, server, username, uuid } = body;

        //! check everything beforehand

        const secondStepAuthResponse = new SecondStepAuthResponse();

        const { status, userRegCache } = await this.authService.checkCacheAndValidation(
            server,
            summonerName,
            uuid,
        );

        if (status === LolAuthStatus.INVALID) {
            secondStepAuthResponse.status = status;
            return secondStepAuthResponse;
        }

        // first checking if email or username already in register cache
        await this.authService.usernameEmailExists(email, username);

        // second checking if email and username already in user
        await this.authService.usernameEmailExists(email, username, { inCache: true });

        // third checking if lol credentials is valid
        // const checkedLolCreds = await this.userService.checkLolCredentialsValid(server, summonerName);

        // update user register cache

        // cache into database
        // const userCached = await this.userService.cacheUserRegister(body, checkedLolCreds).catch(() => {
        //     throw new GenericException(HttpStatus.BAD_REQUEST, ExceptionMessageCode.USER_ALREADY_IN_CACHE);
        // });

        const userCached = await this.authService.cacheUserRegister(userRegCache, body);

        // send to mail
        this.mailServie.sendUserConfirmation(userCached);

        return { check: true };
    }

    @UseGuards(JwtRegisterAuthGuard, ThrottlerGuard)
    @Throttle(configs.general.AUTH_GENERAL_THROTTLE)
    @UseFilters(RegisterCacheExceptionFilter)
    @Get('/register/confirm/')
    async registerVerify(@Query('id', ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        this.cookieService.clearCookie(res);

        // get data from cache
        const cachedData = await this.authService.retrieveRegisterCachedData(id);

        // generate refresh token and new secret
        const { refreshToken, secret } = this.jwtAcessService.generateRefreshToken(cachedData);

        const ip = req.ip || req.header('x-forwarded-for');

        // save additional data to user details and data in user
        const user = await this.userService.saveUserByCachedData(cachedData, secret, ip);
        await this.userDetailsService.saveUserDetailsByCachedData(cachedData, user);

        // generate access_token and refresh token and new secret
        const accessToken = this.jwtAcessService.generateAccessToken(user, user.socket_id);

        // delete user cached data
        await this.userRegisterCacheService.delete(cachedData.id);

        // create user spam filter
        await this.matchingSpamService.createEmptySpam(user);

        // create user belonging containing 0 super like
        await this.userBelongingsService.create(user);

        // send httpOnly access_token, refresh_token cookie
        this.cookieService.createCookie(res, accessToken, refreshToken);

        const redirect = createUrl(configs.general.routes.DASHBOARD_URL, {
            path: configs.general.dashboardRoutes.userProfile,
        });

        return res.redirect(redirect);
    }

    @UseGuards(JwtRefreshTokenAuthGuard)
    @Get('/refresh')
    public async refreshToken(@Req() req: Request, @Res() res: Response) {
        this.cookieService.clearCookie(res);

        const cookies = req.cookies;
        const accessToken = cookies.access_token;

        const accessTokenDecoded = this.jwtService.decode(accessToken) as { id: number; email: string };
        const id = accessTokenDecoded.id;
        const user = await this.userService.findOne(id);

        // generate access_token and refresh token and new secret
        const accessTokenNew = this.jwtAcessService.generateAccessToken(user, user.socket_id);
        const { refreshToken } = this.jwtAcessService.generateRefreshToken(user, user.secret);

        this.cookieService.createCookie(res, accessTokenNew, refreshToken);

        return res.send({ message: 'token refresh successful' });
    }

    @UseGuards(JwtAcessTokenAuthGuard)
    @Get('/check')
    public async checkIfAuth() {
        return true;
    }

    @UseGuards(JwtAcessTokenAuthGuard)
    @Get('/access_token')
    public async getAccessToken(@Req() request: Request) {
        const cookies = request.cookies;

        return cookies?.access_token;
    }

    @UseGuards(JwtAcessTokenAuthGuard)
    @Post('/logout')
    public async logout(@Res() res: Response) {
        this.cookieService.clearCookie(res);

        return res.send({ message: 'logout successful' });
    }

    @UseGuards(ThrottlerGuard)
    @Post('/forgot-password')
    public async forgotPassword(@Body() body: ForgotPasswordRequestDto) {
        const { email, summoner_name } = body;

        // first checking if email already in forgot password cache
        const userCache = (await this.authService.emailExists(email, {
            inForgotPasswordCache: true,
        })) as ForgotPasswordCache;

        console.log(userCache);

        // if already in cache just send token
        if (userCache) {
            // check if summoner name exists
            if (summoner_name !== userCache.summoner_name) {
                throw new GenericException(
                    HttpStatus.NOT_FOUND,
                    ExceptionMessageCode.SUMMONER_NAME_NOT_FOUND,
                );
            }

            return {
                token: userCache.secret_token,
            };
        }

        console.log('past');

        // check if email exists in users and fetch user details as well
        const userWithDetails = (await this.authService.emailExists(email)) as User;

        // check if sommoner name is correct
        if (userWithDetails.details.summoner_name !== summoner_name) {
            throw new GenericException(HttpStatus.NOT_FOUND, ExceptionMessageCode.SUMMONER_NAME_NOT_FOUND);
        }

        // first save dto data to database
        const uuid = v4();

        const unfinishedCachedData = await this.authService.userForgotPasswordCacheService.save(
            userWithDetails.id,
            email,
            summoner_name,
            uuid,
        );

        // generate secret,token and update newly dsaved cache
        const { token, secret } = this.jwtAcessService.generateForgotPasswordToken(unfinishedCachedData.id);
        await this.authService.userForgotPasswordCacheService.update(unfinishedCachedData.id, token, secret);

        // send uuid to mail
        await this.mailServie.sendForgotPasswordUUID(
            userWithDetails.email,
            uuid,
            userWithDetails.details.summoner_name,
        );

        return {
            token,
            msg: 'uuid code sent',
        };
    }

    @UseGuards(ThrottlerGuard, JwtForgotPasswordAuthGuard)
    @Throttle(5) // minimal throttle for password update in minute
    @Post('/forgot-password/confirm')
    public async forgotPasswordUpdate(
        @Body() body: ForgotPasswordConfirmRequestDto,
        @Req() req: ForgotPasswordRequest,
    ) {
        //(!!!) no need for email checkup token checkup and cache checkup happens inside guard, uuid is validate as well from dto
        const { uuid, new_password } = body;
        const forgotPasswordCache = req.forgotPasswordCache;

        // validate if uuid is correct
        if (uuid !== forgotPasswordCache.uuid) {
            throw new GenericException(HttpStatus.BAD_REQUEST, ExceptionMessageCode.INCORRECT_UUID);
        }

        // delete from cache
        await this.authService.userForgotPasswordCacheService.delete(forgotPasswordCache.id);

        // update password
        await this.userService.updatePassword(forgotPasswordCache.user_id, new_password);

        // return response
        return {
            msg: 'updated password successfully',
        };
    }
}

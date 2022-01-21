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
    HttpStatus as HTTS,
    HttpStatus,
} from '@nestjs/common';
import { User } from 'src/database/entity/user.entity';
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
import { Throttle, ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';
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
import { SummonerAuthRequestStep2 } from '../schemas/request/auth/summoner_auth_step_2.request';
import { LolAuthStatus } from '../common/enum/lol_auth_statuses.enum';
import { GeneralHelper } from '../utils/general.helper';
import { FirstStepAuthResponse, SecondStepAuthResponse } from '../modules/auth/response/second_step_auth.response';
import { SummonerDetailsFailure } from '../common/failures/lol_api/summoner_details.failure.enum';
import { SummonerAuthRequestStep1 } from '../schemas/request/auth/summoner_auth_step_1.request';
import { SummonerAuthCheckParams } from '../schemas/request/auth/summoner_auth_step_2_check.request';
import { NetworkProvider } from '../modules/network/network.provider';
import { SummonerDetailsAndLeagueFailure } from '../common/failures/lol_api/summoner_details_league.failure.enum';

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
    async registerFirstStep(@Body() body: SummonerAuthRequestStep1): Promise<FirstStepAuthResponse> {
        // timestamp check needed
        const { server, summonerName } = body;

        // check if summoner name and server exists in cache
        const userRegisterCache = await this.authService.retrieveRegisterCache(server, summonerName);

        // if exists and timestamp still in motion then throw exception
        if (userRegisterCache && userRegisterCache.timestamp_now) {
            const differenceMin = GeneralHelper.dater.timeDifferenceMinutes(userRegisterCache.timestamp_now);

            if (differenceMin.min < configs.general.REGISTER_TIMESTAMP_DURATION) {
                return { uuid: userRegisterCache.uuid, timeLeft: differenceMin };
            }
        }

        // check if server and summoner_name is already in use in user details
        const userDetails = await this.userDetailsService.findBySummonerAndServer(server, summonerName);

        if (userDetails) {
            throw new GenericException(HTTS.BAD_REQUEST, ExceptionMessageCode.SUMMONER_NAME_ALREADY_IN_USE);
        }

        // const userRegisterRenewedCache = await this.authService.renewSummonerNameAndServer(
        //     userRegisterCache,
        //     server,
        //     summonerName,
        // );

        // if exists delete and then renew, else create new and then return
        if (userRegisterCache) {
            await this.userRegisterCacheService.delete(userRegisterCache.id);
        }

        const summonerDetailsAndLeague = await this.userService.summonerNameDetailsAndLeague(server, summonerName);

        const userRegisterRenewedCache = await summonerDetailsAndLeague.fold(
            async (l) => {
                switch (l) {
                    case SummonerDetailsAndLeagueFailure.UNKNOWN:
                        throw new GenericException(
                            HttpStatus.INTERNAL_SERVER_ERROR,
                            ExceptionMessageCode.INTERNAL_SERVER_ERROR,
                            ';dddd',
                        );
                    case SummonerDetailsAndLeagueFailure.SUMMONER_NAME_NOT_FOUND:
                        throw new GenericException(
                            HttpStatus.NOT_FOUND,
                            ExceptionMessageCode.SUMMONER_NAME_NOT_FOUND,
                        );
                    case SummonerDetailsAndLeagueFailure.SUMMONER_DIVISION_ERROR:
                        throw new GenericException(
                            HttpStatus.BAD_REQUEST,
                            ExceptionMessageCode.SUMMONER_DIVISION_ERROR,
                        );
                }
            },

            async (r) => {
                // create new
                const userRegisterRenewedCache = await this.userRegisterCacheService.createFirstStepCache(
                    server,
                    summonerName,
                    r,
                );

                return userRegisterRenewedCache;
            },
        );

        // fetch data from lol
        // const summonerData = await this.networkProvider.lolRemoteService.summonerNameDetailsAndLeague(
        //     server,
        //     summonerName,
        // );

        return { uuid: userRegisterRenewedCache.uuid };
    }

    @UseGuards(ThrottlerGuard)
    @Throttle(configs.general.AUTH_GENERAL_THROTTLE)
    @Get('/register/step/2/check')
    async registerSecondStepCheck(@Query() queryData: SummonerAuthCheckParams): Promise<SecondStepAuthResponse> {
        const { server, summonerName, uuid } = queryData;

        const userRegCache = await this.authService.retrieveRegisterCache(server, summonerName, uuid);

        if (!userRegCache) return { status: LolAuthStatus.INVALID };

        const differenceMin = GeneralHelper.dater.timeDifferenceMinutes(userRegCache.timestamp_now);

        // if timestamp difference is more than register timestamp duration
        if (differenceMin.min > configs.general.REGISTER_TIMESTAMP_DURATION) {
            return { status: LolAuthStatus.INVALID_TIMESTAMP };
        }

        const summonerOnlyDetailsResponse = await this.userService.summonerNameDetails(server, summonerName);

        return summonerOnlyDetailsResponse.fold<Promise<SecondStepAuthResponse>>(
            async (l) => {
                switch (l) {
                    case SummonerDetailsFailure.UNKNOWN:
                    case SummonerDetailsFailure.SUMMONER_NAME_NOT_FOUND:
                        return { status: LolAuthStatus.INVALID };
                }
            },

            async (r) => {
                if (userRegCache.profile_icon_id !== r.profileIconId) {
                    // change validate to true and return
                    await this.userRegisterCacheService.updateValidation(userRegCache.id, true);

                    return { status: LolAuthStatus.VALID };
                }

                return { status: LolAuthStatus.VALID_TIMESTAMP, timeLeft: differenceMin };
            },
        );
    }

    /**
     * @description Big logic for checking cache
     *
     * check if summoner name and server exists in cache
     *      true -> if exists then check first if is validated
     *              true -> return validated
     *
     *           -> fetch new data and check if profile icon id is changed
     *              true -> change validated to true
     *                   -> return validated
     *
     *           -> if time stamp is left
     *              true -> return left time
     *              false -> return timestamp invalid
     */
    @UseGuards(ThrottlerGuard)
    @Throttle(configs.general.AUTH_GENERAL_THROTTLE)
    @Post('/register/step/2')
    async registerSecondStep(@Body() body: SummonerAuthRequestStep2): Promise<SecondStepAuthResponse> {
        const { server, summonerName, uuid } = body;

        const userRegCache = await this.authService.retrieveRegisterCache(server, summonerName, uuid);

        // check cache existence
        if (!userRegCache) {
            throw new GenericException(HTTS.NOT_FOUND, ExceptionMessageCode.REGISTER_CACHE_NOT_FOUND);
        }

        // get date difference between now dan cache timestamp starting point
        const differenceMin = GeneralHelper.dater.timeDifferenceMinutes(userRegCache.timestamp_now);

        // if timestamp difference is more than for some minutes
        if (differenceMin.min > configs.general.REGISTER_TIMESTAMP_DURATION) {
            throw new GenericException(HTTS.BAD_REQUEST, ExceptionMessageCode.AUTH_REGISTER_INVALID_TIMESTAMP);
        }

        // get summoner details from lol api
        const summonerOnlyDetailsResponse = await this.userService.summonerNameDetails(server, summonerName);

        // check for api exception and return response
        const summonerDetails = summonerOnlyDetailsResponse.fold(
            (l) => {
                switch (l) {
                    case SummonerDetailsFailure.UNKNOWN:
                        throw new GenericException(
                            HTTS.INTERNAL_SERVER_ERROR,
                            ExceptionMessageCode.INTERNAL_SERVER_ERROR,
                        );

                    case SummonerDetailsFailure.SUMMONER_NAME_NOT_FOUND:
                        throw new GenericException(HTTS.BAD_REQUEST, ExceptionMessageCode.SUMMONER_NAME_NOT_FOUND);
                }
            },
            (r) => r,
        );

        // check for profile icon change if change response
        if (userRegCache.profile_icon_id !== summonerDetails.profileIconId) {
            // change validate to true and return
            await this.userRegisterCacheService.updateValidation(userRegCache.id, true);
            return { status: LolAuthStatus.VALID };
        }

        // if nothing above just return left time
        return { status: LolAuthStatus.VALID_TIMESTAMP, timeLeft: differenceMin };
    }

    @UseGuards(ThrottlerGuard)
    @Throttle(configs.general.AUTH_GENERAL_THROTTLE)
    @Post('/register/step/3')
    async register(@Body() body: UserRegisterDto): Promise<void> {
        const { server, summonerName, uuid } = body;
        const userRegCache = await this.authService.retrieveRegisterCache(server, summonerName, uuid);

        if (!userRegCache) {
            throw new GenericException(HTTS.NOT_FOUND, ExceptionMessageCode.REGISTER_CACHE_NOT_FOUND);
        }

        if (!userRegCache.is_valid) {
            throw new GenericException(HTTS.BAD_REQUEST, ExceptionMessageCode.SUMMONER_PROFILE_NOT_VALIDATED);
        }

        // first checking if email or username already in register cache
        const userCache = await this.userRegisterCacheService.findByEmailOrUsername(body.email, body.username);

        if (userCache && userCache.email === body.email) {
            throw new GenericException(HTTS.BAD_REQUEST, ExceptionMessageCode.USER_EMAIL_ALREADY_IN_USE);
        }

        if (userCache && userCache.username === body.username) {
            throw new GenericException(HTTS.BAD_REQUEST, ExceptionMessageCode.USERNAME_ALREADY_IN_USE);
        }

        // second checking if email and username already in user
        const user = await this.userService.findByEmailOrUsername(body.email, body.username);

        if (user && user.email === body.email) {
            throw new GenericException(HTTS.BAD_REQUEST, ExceptionMessageCode.USER_EMAIL_ALREADY_IN_USE);
        }

        if (user && user.username === body.username) {
            throw new GenericException(HTTS.BAD_REQUEST, ExceptionMessageCode.USERNAME_ALREADY_IN_USE);
        }

        const userCached = await this.authService.cacheUserRegister(userRegCache, body);
        this.mailServie.sendUserConfirmation(userCached);

        return null;
    }

    @UseGuards(JwtRegisterAuthGuard, ThrottlerGuard)
    @Throttle(configs.general.AUTH_GENERAL_THROTTLE)
    @UseFilters(RegisterCacheExceptionFilter)
    @Get('/register/confirm/')
    async registerVerify(@Query('id', ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        this.cookieService.clearCookie(res);
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
    async refreshToken(@Req() req: Request, @Res() res: Response) {
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
    async checkIfAuth() {
        return true;
    }

    @UseGuards(JwtAcessTokenAuthGuard)
    @Get('/access_token')
    async getAccessToken(@Req() request: Request) {
        const cookies = request.cookies;

        return cookies?.access_token;
    }

    @UseGuards(JwtAcessTokenAuthGuard)
    @Post('/logout')
    async logout(@Res() res: Response) {
        this.cookieService.clearCookie(res);

        return res.send({ message: 'logout successful' });
    }

    @UseGuards(ThrottlerGuard)
    @Post('/forgot-password')
    async forgotPassword(@Body() body: ForgotPasswordRequestDto) {
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
                throw new GenericException(HTTS.NOT_FOUND, ExceptionMessageCode.SUMMONER_NAME_NOT_FOUND);
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
            throw new GenericException(HTTS.NOT_FOUND, ExceptionMessageCode.SUMMONER_NAME_NOT_FOUND);
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
    @Throttle(5)
    @Post('/forgot-password/confirm')
    async forgotPasswordUpdate(@Body() body: ForgotPasswordConfirmRequestDto, @Req() req: ForgotPasswordRequest) {
        //(!!!) no need for email checkup token checkup and cache checkup happens inside guard, uuid is validate as well from dto
        const { uuid, new_password } = body;
        const forgotPasswordCache = req.forgotPasswordCache;

        // validate if uuid is correct
        if (uuid !== forgotPasswordCache.uuid) {
            throw new GenericException(HTTS.BAD_REQUEST, ExceptionMessageCode.INCORRECT_UUID);
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

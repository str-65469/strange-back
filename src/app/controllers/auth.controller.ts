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
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthService } from '../services/core/auth/auth.service';
import { JwtAcessService } from '../services/common/jwt_access.service';
import { MailService } from 'src/app/mail/mail.service';
import { JwtRegisterAuthGuard } from '../security/guards/jwt_register.guard';
import { JwtAcessTokenAuthGuard } from '../security/guards/jwt_access.guard';
import { UserBelongingsService } from 'src/app/services/core/user/user_belongings.service';
import { CookieService } from 'src/app/services/common/cookie.service';
import { MatchingSpamService } from 'src/app/services/core/matcheds/matching_spam.service';
import { UserLoginDto } from '../common/request/user/user_login.dto';
import { UsersService } from '../services/core/user/users.service';
import { UserDetailsServiceService } from '../services/core/user/user_details.service';
import { UserRegisterCacheService } from '../services/core/user/user_register_cache.service';
import { UserRegisterDto } from '../common/request/user/user_register.dto';
import { RegisterCacheExceptionFilter } from '../common/exception_filters/register_cache.excpetion.filter';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtRefreshTokenAuthGuard } from '../security/guards/jwt_refresh.guard';
import { ForgotPasswordRequest, JwtForgotPasswordAuthGuard } from '../security/guards/jwt_forgot_password.guard';
import { ForgotPasswordRequestDto } from '../common/request/forgot_password/forgot_password.dto';
import { ForgotPasswordConfirmRequestDto } from '../common/request/forgot_password/forgot_password_confirm.dto';
import { classToPlain } from 'class-transformer';
import { createUrl } from '../utils/url_builder';
import { configs } from 'src/configs/config';
import { GenericException } from '../common/exceptions/general.exception';
import { ExceptionMessageCode } from '../common/enum/message_codes/exception_message_code.enum';
import { v4 } from 'uuid';
import User from 'src/database/entity/user.entity';
import { ForgotPasswordCache } from 'src/database/entity/forgot_password_cache.entity';

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
  ) {}

  @UseGuards(ThrottlerGuard)
  @Throttle(60)
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
  @Throttle(60)
  @Post('/register')
  async register(@Body() body: UserRegisterDto) {
    const { email, summoner_name, server, username } = body;

    // first checking if email or username already in register cache
    await this.authService.usernameEmailExists(email, username);

    // second checking if email and username already in user (avoid lot of api request, will become fourth after riot production key)
    await this.authService.usernameEmailExists(email, username, { inCache: true });

    // fourth checking if server and summoner_name is already in use in user details
    await this.authService.summonerNameAndServerExists(server, summoner_name);

    // third checking if lol credentials is valid
    const checkedLolCreds = await this.userService.checkLolCredentialsValid(server, summoner_name);

    // third cache into database
    const userCached = await this.userService.cacheUserRegister(body, checkedLolCreds).catch((err) => {
      throw new GenericException(HttpStatus.BAD_REQUEST, ExceptionMessageCode.USER_ALREADY_IN_CACHE);
    });

    // send to mail
    this.mailServie.sendUserConfirmation(userCached);

    return { checkedLolCreds, check: true };
  }

  @UseGuards(JwtRegisterAuthGuard, ThrottlerGuard)
  @Throttle(60)
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

    const redirect = createUrl(configs.general.routes.DASHBOARD_URL, { path: configs.general.dashboardRoutes.userProfile });

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
    const userCache = (await this.authService.emailExists(email, { inForgotPasswordCache: true })) as ForgotPasswordCache;

    // if already in cache just send token
    if (userCache) {
      return {
        token: userCache.secret_token,
        msg: 'uuid code sent',
      };
    }

    // check if email exists in users and fetch user details as well
    const userWithDetails = (await this.authService.emailExists(email)) as User;

    // check if sommoner name and server is correct
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
    await this.mailServie.sendForgotPasswordUUID(userWithDetails.email, uuid, userWithDetails.details.summoner_name);

    return {
      token,
      msg: 'uuid code sent',
    };
  }

  @UseGuards(ThrottlerGuard, JwtForgotPasswordAuthGuard)
  @Throttle(5) // minimal throttle for password update in minute
  @Post('/forgot-password/confirm')
  public async forgotPasswordUpdate(@Body() body: ForgotPasswordConfirmRequestDto, @Req() req: ForgotPasswordRequest) {
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

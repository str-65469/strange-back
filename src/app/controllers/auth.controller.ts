import { Controller, Post, Res, Body, Get, Query, ParseIntPipe, UseGuards, Req, UseFilters } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthService } from '../services/core/auth/auth.service';
import { JwtAcessService } from '../services/common/jwt_access.service';
import { MailService } from 'src/app/mail/mail.service';
import { JwtRegisterAuthGuard } from '../security/guards/jwt_register.guard';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtAcessTokenAuthGuard } from '../security/auth/jwt_access.guard';
import { UserBelongingsService } from 'src/app/services/core/user/user_belongings.service';
import { CookieService } from 'src/app/services/common/cookie.service';
import { MatchingSpamService } from 'src/app/services/core/matcheds/matching_spam.service';
import { UserLoginDto } from '../common/request/user/user_login.dto';
import { UsersService } from '../services/core/user/users.service';
import { UserDetailsServiceService } from '../services/core/user/user_details.service';
import { UserRegisterCacheService } from '../services/core/user/user_register_cache.service';
import { JwtRefreshTokenAuthGuard } from '../security/auth/jwt_refresh.guard';
import { UserRegisterDto } from '../common/request/user/user_register.dto';
import { RegisterCacheExceptionFilter } from '../common/exceptions/register_cache.excpetion.filter';

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

    @InjectRepository(UserRegisterCache)
    private readonly userRegisterCacheRepo: Repository<UserRegisterCache>,
  ) {}

  @Post('/login')
  async login(@Body() body: UserLoginDto, @Res() res: Response) {
    this.cookieService.clearCookie(res);

    const user = await this.authService.validateUser(body);
    const accessToken = this.jwtAcessService.generateAccessToken(user, user.socket_id);
    const { refreshToken } = this.jwtAcessService.generateRefreshToken(user, user.secret);

    // await this.userService.saveUser(user, secret);

    this.cookieService.createCookie(res, accessToken, refreshToken);
    return res.send(user);
  }

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

    console.log(checkedLolCreds);

    return checkedLolCreds.pipe(
      map(async (res) => {
        // third cache into database
        const userCached = await this.userService.cacheUserRegister(body, res);

        // send to mail
        this.mailServie.sendUserConfirmation(userCached);

        return { checkedLolCreds, check: true };
      }),
    );
  }

  @UseGuards(JwtRegisterAuthGuard)
  @UseFilters(RegisterCacheExceptionFilter)
  @Get('/register/confirm/')
  async registerVerify(@Query('id', ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
    this.cookieService.clearCookie(res);

    // get data from cache
    const cachedData = await this.authService.retrieveCachedData(id);

    // generate refresh token and new secret
    const { refreshToken, secret } = this.jwtAcessService.generateRefreshToken(cachedData);
    const possibleIP = req.headers['x-forwarded-for'] as string;
    const ip = possibleIP || req.socket.remoteAddress || null;

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

    return res.redirect(`${process.env.DASHBOARD_URL}/profile`);
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

    // update user secret
    // await this.userService.saveUser(user, secret);

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
}

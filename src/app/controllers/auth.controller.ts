import { map } from 'rxjs/operators';
import { UserRegisterCacheService } from '../modules/user/services/user_register_cache.service';
import { UserDetailsServiceService } from '../modules/user/services/user_details.service';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from '../modules/user/dto/user-register.dto';
import { UserLoginDto } from '../modules/user/dto/user-login.dto';
import {
  Controller,
  Post,
  Res,
  Body,
  Get,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../modules/auth/auth.service';
import { JwtAcessService } from '../services/common/jwt-access.service';
import { UsersService } from '../modules/user/services/users.service';
import { MailService } from 'src/mail/mail.service';
import { JwtRegisterAuthGuard } from '../modules/auth/guards/jwt-register.guard';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtRefreshTokenAuthGuard } from '../modules/auth/guards/jwt-refresh.guard';
import { JwtAcessTokenAuthGuard } from '../modules/auth/guards/jwt-access.guard';
import { UserBelongingsService } from 'src/app/services/core/user/user_belongings.service';
import { CookieService } from 'src/app/services/common/cookie.service';
import { MatchingSpamService } from 'src/app/services/core/matcheds/matchingspamservice.service';

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

    // first check if user exists
    await this.authService.usernameEmailSummonerExists(email, username, summoner_name);

    // second check if user lol credentials is valid
    const checkedLolCreds = await this.userService.checkLolCredentialsValid(server, summoner_name);

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
  @Get('/register/confirm/')
  async registerVerify(@Query('id', ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
    this.cookieService.clearCookie(res);

    // get data from cache
    const cachedData = await this.userRegisterCacheRepo.findOne(id);

    if (!cachedData) {
      throw new HttpException('Cached information not found', HttpStatus.BAD_REQUEST);
    }

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

    // send httpOnly access_token cookie
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

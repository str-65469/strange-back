import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookieService {
  public clearCookie(res: Response) {
    if (process.env.NODE_ENV === 'development') {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
    } else {
      res.clearCookie('access_token', { domain: process.env.COOKIE_DOMAIN });
      res.clearCookie('refresh_token', { domain: process.env.COOKIE_DOMAIN });
    }
  }

  public createCookie(res: Response, accessToken: string, refreshToken: string) {
    // send httpOnly access_token cookie
    if (process.env.NODE_ENV === 'development') {
      res.cookie('access_token', accessToken, {
        expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
        httpOnly: true,
      });

      res.cookie('refresh_token', refreshToken, {
        expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
        httpOnly: true,
      });
    } else {
      res.cookie('access_token', accessToken, {
        expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
      });

      res.cookie('refresh_token', refreshToken, {
        expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
      });
    }
  }
}

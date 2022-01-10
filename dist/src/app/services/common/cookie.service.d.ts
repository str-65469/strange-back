import { Response } from 'express';
export declare class CookieService {
    clearCookie(res: Response): void;
    createCookie(res: Response, accessToken: string, refreshToken: string): void;
}

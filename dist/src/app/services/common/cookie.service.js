"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieService = void 0;
const common_1 = require("@nestjs/common");
let CookieService = class CookieService {
    clearCookie(res) {
        if (process.env.NODE_ENV === 'development') {
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
        }
        else {
            res.clearCookie('access_token', { domain: process.env.COOKIE_DOMAIN });
            res.clearCookie('refresh_token', { domain: process.env.COOKIE_DOMAIN });
        }
    }
    createCookie(res, accessToken, refreshToken) {
        if (process.env.NODE_ENV === 'development') {
            res.cookie('access_token', accessToken, {
                expires: new Date(new Date().getTime() + 86409000),
                httpOnly: true,
            });
            res.cookie('refresh_token', refreshToken, {
                expires: new Date(new Date().getTime() + 86409000),
                httpOnly: true,
            });
        }
        else {
            res.cookie('access_token', accessToken, {
                expires: new Date(new Date().getTime() + 86409000),
                httpOnly: true,
                domain: process.env.COOKIE_DOMAIN,
            });
            res.cookie('refresh_token', refreshToken, {
                expires: new Date(new Date().getTime() + 86409000),
                httpOnly: true,
                domain: process.env.COOKIE_DOMAIN,
            });
        }
    }
};
CookieService = __decorate([
    (0, common_1.Injectable)()
], CookieService);
exports.CookieService = CookieService;
//# sourceMappingURL=cookie.service.js.map
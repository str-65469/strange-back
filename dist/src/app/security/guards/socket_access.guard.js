"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketAccessGuard = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const jwt_access_service_1 = require("../../services/common/jwt_access.service");
let SocketAccessGuard = class SocketAccessGuard {
    constructor(jwtAcessService) {
        this.jwtAcessService = jwtAcessService;
    }
    async canActivate(context) {
        var _a, _b;
        const request = context.switchToWs();
        const token = (_b = (_a = request.getClient().handshake) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.token;
        if (!token) {
            throw new websockets_1.WsException('Token missing');
        }
        const jwtPayload = await this.jwtAcessService.validateToken({
            is_socket: true,
            token,
            secret: process.env.JWT_SECRET,
        });
        return true;
    }
};
SocketAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_access_service_1.JwtAcessService])
], SocketAccessGuard);
exports.SocketAccessGuard = SocketAccessGuard;
//# sourceMappingURL=socket_access.guard.js.map
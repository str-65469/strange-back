/// <reference types="node" />
import User from 'src/database/entity/user.entity';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { JwtService } from '@nestjs/jwt';
import { IncomingHttpHeaders } from 'http2';
interface ValidateAcessTokenProps {
    token: string;
    secret: string;
    is_socket?: boolean;
    clbck?: () => any;
    expired_clbck?: () => any;
}
export interface AccessTokenPayload {
    id: number;
    username: string;
    socket_id: string;
}
export declare class JwtAcessService {
    readonly jwtService: JwtService;
    constructor(jwtService: JwtService);
    generateAccessToken(user: User | UserRegisterCache, socketId: string): string;
    generateRefreshToken(user: User | UserRegisterCache, userSecret?: string): {
        secret: string;
        refreshToken: string;
    };
    generateForgotPasswordToken(id: number): {
        secret: string;
        token: string;
    };
    validateToken(params: ValidateAcessTokenProps): Promise<AccessTokenPayload>;
    getForgotPasswordToken(headers: IncomingHttpHeaders): string | null;
}
export {};

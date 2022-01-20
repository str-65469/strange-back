import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { CredentialsResponse } from '../schemas/response/credentials/credentials.response';
import { JwtAcessTokenAuthGuard } from '../guards/jwt_access.guard';
import { UserSafeInterceptor } from '../interceptors/user_safe.interceptor';
import { CredentialsService } from '../modules/non_auth/credentials.service';

@UseGuards(JwtAcessTokenAuthGuard)
@Controller('credentials')
export class CredentialsController {
    constructor(private readonly credentialsService: CredentialsService) {}

    @Get()
    @UseInterceptors(UserSafeInterceptor)
    public credentials(): CredentialsResponse {
        return this.credentialsService.credentials();
    }
}

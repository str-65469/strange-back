import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { CredentialsResponse } from '../common/response/credentials/credentials.response';
import { JwtAcessTokenAuthGuard } from '../security/guards/jwt_access.guard';
import { UserSafeInterceptor } from '../security/interceptors/user_safe.interceptor';
import { CredentialsService } from '../services/core/credentials.service';

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

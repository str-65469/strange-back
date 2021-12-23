import * as dotenv from 'dotenv';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException, HttpException)
export class RegisterCacheExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | UnauthorizedException, host: ArgumentsHost) {
    // first load dotenv
    dotenv.config();

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status === HttpStatus.UNAUTHORIZED) {
      return response.status(status).redirect(`${process.env.MARKUP_URL}/registration_timeout`);
    }

    return response.status(status).redirect(`${process.env.MARKUP_URL}/not_found`);
  }
}

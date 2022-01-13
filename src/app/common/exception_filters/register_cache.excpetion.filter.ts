import * as dotenv from 'dotenv';
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { configs } from 'src/configs/config';
import { buildUrl } from 'src/app/utils/url_builder.helper';
import { GenericException } from '../exceptions/general.exception';
import { GenericExceptionProps } from './all_exception.filter';

@Catch(GenericException)
export class RegisterCacheExceptionFilter implements ExceptionFilter {
  catch(exception: GenericException, host: ArgumentsHost) {
    // first load dotenv
    dotenv.config();

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse() as GenericExceptionProps;
    const status = exception.getStatus();
    const url = buildUrl(configs.general.routes.MARKUP_URL);
    const { registerTimeout, notFound } = configs.general.frontMarkupRoutes;

    if (exceptionResponse.statusCode === HttpStatus.UNAUTHORIZED) {
      return response.status(status).redirect(url.addUrlParams(registerTimeout).getUrl);
    }

    return response.status(status).redirect(url.addUrlParams(notFound).getUrl);
  }
}

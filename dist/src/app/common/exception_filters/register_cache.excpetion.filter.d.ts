import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { GenericException } from '../exceptions/general.exception';
export declare class RegisterCacheExceptionFilter implements ExceptionFilter {
    catch(exception: GenericException, host: ArgumentsHost): void;
}

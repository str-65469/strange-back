import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionMessageCode } from '../enum/message_codes/exception_message_code.enum';
export declare class GenericException extends HttpException {
    constructor(statusCode: HttpStatus, messageCode: ExceptionMessageCode, message?: string);
}

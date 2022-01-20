import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionMessageCode } from '../enum/message_codes/exception_message_code.enum';
import { GenericExceptionProps } from '../exception_filters/all_exception.filter';

export interface GenericExceptionResponse {
    message: string | null;
    messageCode: ExceptionMessageCode | null;
    statusCode: number | null;
}

export class GenericException extends HttpException {
    constructor(statusCode: HttpStatus, messageCode: ExceptionMessageCode, message?: string) {
        const generalExceptonProps: GenericExceptionProps = {
            statusCode,
            messageCode,
            message,
        };

        super(generalExceptonProps, statusCode);
    }
}

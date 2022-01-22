import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import e, { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { configs } from 'src/configs/config';
import { ExceptionMessageCode } from '../enum/message_codes/exception_message_code.enum';
import { GenericException } from '../exceptions/general.exception';

interface GenericExceptionPropsStack {
    path: string;
    method: string;
    extraStack: any;
    timestamp: string;
    headers: IncomingHttpHeaders;
}

export interface GenericExceptionProps {
    message: string;
    messageCode: ExceptionMessageCode;
    statusCode: HttpStatus;
    stack?: Partial<GenericExceptionPropsStack>;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const httpAdapter = this.httpAdapterHost?.httpAdapter;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest() as Request;
        let responseBody: GenericExceptionProps | null = null;

        // can be removed or saved in some file
        this.logInternalServerErrors(exception);

        // http exceptions
        if (exception instanceof GenericException) {
            const exceptionResponse = exception.getResponse() as GenericExceptionProps;
            const statusCode = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

            responseBody = {
                message: exceptionResponse?.message ?? configs.messages.exceptions.generalMessage,
                messageCode: exceptionResponse?.messageCode ?? ExceptionMessageCode.INTERNAL_SERVER_ERROR,
                statusCode,
                stack: this.getAdditionInfo(request, exception),
            };

            return httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
        }

        // http exceptions not thrown by me
        if (exception instanceof HttpException) {
            const exceptionResponseBody = exception.getResponse() as any;
            const statusCode = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
            const message = Array.isArray(exceptionResponseBody?.message)
                ? exceptionResponseBody?.message[0]
                : null;

            responseBody = {
                message: message ?? exception.message,
                messageCode: ExceptionMessageCode.GENERAL_ERROR,
                statusCode,
                stack: this.getAdditionInfo(request, exception),
            };

            return httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
        }

        // general and internal errors
        return httpAdapter.reply(
            ctx.getResponse(),
            {
                message: 'internal server error',
                messageCode: ExceptionMessageCode.INTERNAL_SERVER_ERROR,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                stack: this.getAdditionInfo(request, exception),
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }

    private getAdditionInfo(request: Request, exception: any) {
        const additionalParams: GenericExceptionPropsStack = {
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            headers: request.headers,
            extraStack: exception && Object.values(exception).length ? exception : undefined,
        };

        return process.env.NODE_ENV === 'development' ? additionalParams : undefined;
    }

    private logInternalServerErrors(exception: any) {
        if (exception && exception.hasOwnProperty('getStatus') && exception.getStatus() === 500) {
            console.log(exception);
        }
    }
}

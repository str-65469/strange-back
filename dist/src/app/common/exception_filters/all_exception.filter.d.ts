/// <reference types="node" />
import { ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { IncomingHttpHeaders } from 'http';
import { ExceptionMessageCode } from '../enum/message_codes/exception_message_code.enum';
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
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly httpAdapterHost;
    constructor(httpAdapterHost: HttpAdapterHost);
    catch(exception: unknown, host: ArgumentsHost): void;
    private getAdditionInfo;
}
export {};

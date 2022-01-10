import { ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { ExceptionMessageCode } from '../enum/message_codes/exception_message_code.enum';
import { GenericSocketException } from '../exceptions/general_socket.exception';
export interface GenericSocketExceptionProps {
    messageCode: ExceptionMessageCode;
    message?: string;
    stack?: string;
}
export declare class AllSocketExceptionsFilter extends BaseWsExceptionFilter {
    catch(exception: GenericSocketException, host: ArgumentsHost): void;
}

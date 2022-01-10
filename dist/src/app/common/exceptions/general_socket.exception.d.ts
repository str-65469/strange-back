import { WsException } from '@nestjs/websockets';
import { ExceptionMessageCode } from '../enum/message_codes/exception_message_code.enum';
export declare class GenericSocketException extends WsException {
    constructor(messageCode: ExceptionMessageCode, message?: string);
}

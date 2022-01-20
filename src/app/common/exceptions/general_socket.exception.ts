import { WsException } from '@nestjs/websockets';
import { ExceptionMessageCode } from '../enum/message_codes/exception_message_code.enum';
import { GenericSocketExceptionProps } from '../exception_filters/all_socket_exception.filter';

export class GenericSocketException extends WsException {
    constructor(messageCode: ExceptionMessageCode, message?: string) {
        const generalExceptonProps: GenericSocketExceptionProps = {
            messageCode,
            message,
        };

        super(generalExceptonProps);
    }
}

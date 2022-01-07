import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { configs } from 'src/configs/config';
import { ExceptionMessageCode } from '../enum/message_codes/exception_message_code.enum';
import { GenericSocketException } from '../exceptions/general_socket.exception';

export interface GenericSocketExceptionProps {
  messageCode: ExceptionMessageCode;
  message?: string;
  stack?: string;
}

@Catch(GenericSocketException)
export class AllSocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: GenericSocketException, host: ArgumentsHost) {
    const props = exception.getError() as GenericSocketExceptionProps;
    const responseBody: GenericSocketExceptionProps = {
      message: props?.message ?? configs.messages.exceptions.generalMessage,
      messageCode: props?.messageCode ?? ExceptionMessageCode.INTERNAL_SERVER_ERROR,
      stack: process.env.NODE_ENV === 'development' ? exception.stack : null,
    };

    // create proper (e.g. custom made WsException)
    const genericSocketException = new WsException(responseBody);

    super.catch(genericSocketException, host);
  }
}

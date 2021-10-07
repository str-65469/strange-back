import { HttpException, HttpStatus } from '@nestjs/common';
import { MessageCode } from 'src/enum/exceptions/general_exception.enum';

interface GeneralExceptonProps {
  message: string;
  status_code: number;
  message_code: MessageCode;
  [key: string]: any; // add any other props
}

export class GeneralException extends HttpException {
  constructor(statusCode: HttpStatus, opts: GeneralExceptonProps) {
    super(opts, statusCode);
  }
}

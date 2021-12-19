import { HttpStatus } from '@nestjs/common';
import { ResponseStatusCode } from 'src/app/enum/status_code';

export interface JsonResponse {
  message?: string;
  data?: any;
  statusCode?: HttpStatus;
  responseCode?: ResponseStatusCode;
}

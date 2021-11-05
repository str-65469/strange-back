import { ResponseStatusCode } from '../schemas/status_code';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseBody {
  public json(data: { message?: string; data?: any; statusCode?: ResponseStatusCode }) {
    return {
      message: data?.message ?? '',
      data: data?.data ?? null,
      status: data?.statusCode ?? ResponseStatusCode.HTTP_OK,
    };
  }
}

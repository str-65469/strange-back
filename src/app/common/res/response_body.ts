import { ResponseStatusCode } from '../../enum/status_code';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JsonResponse } from './res.interface';

@Injectable()
export class ResponseBody {
  public json(data: JsonResponse): JsonResponse {
    return {
      message: data?.message ?? '',
      data: data?.data ?? null,
      statusCode: data?.statusCode ?? HttpStatus.OK,
      responseCode: data?.responseCode ?? ResponseStatusCode.HTTP_OK,
    };
  }
}

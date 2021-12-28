import { HttpStatus, Injectable } from '@nestjs/common';

interface JsonResponse {
  message?: string;
  data?: any;
  statusCode?: HttpStatus;
  //   responseCode?: ResponseMessageCode;
}

@Injectable()
export class ResponseBody {
  public json(data: JsonResponse): JsonResponse {
    return {
      message: data?.message ?? '',
      data: data?.data ?? null,
      statusCode: data?.statusCode ?? HttpStatus.OK,
      //   responseCode: data?.responseCode ?? ResponseMessageCode.HTTP_OK,
    };
  }
}

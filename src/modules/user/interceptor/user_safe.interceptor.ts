import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserSafeInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && data.img_path) {
          data.full_image_path = data.img_path ? process.env.APP_URL + '/upload' + data.img_path : null;
        }

        // console.log('====================');
        // console.log(data);
        // console.log(data && data.img_path);

        return classToPlain(data);
      }),
    );
  }
}

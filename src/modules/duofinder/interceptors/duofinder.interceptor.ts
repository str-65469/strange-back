import { FileHelper } from 'src/app/helpers/file_helper';
import { DuoFinderResponseInit } from 'src/app/shared/schemas/duofinder/response';
import { Injectable, NestInterceptor, CallHandler } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class DuofinderInterceptor implements NestInterceptor {
  intercept(_, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data: DuoFinderResponseInit) => {
        const user = data.found_duo;

        data.found_duo.full_image_path = FileHelper.imagePath(data.found_duo.img_path);

        if (data.notifications && data.notifications.length) {
          data.notifications = data.notifications.map((n) => classToPlain(n));
        }

        return classToPlain(data);
      }),
    );
  }
}

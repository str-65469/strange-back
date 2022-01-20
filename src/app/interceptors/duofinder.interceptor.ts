import { DuoFinderResponseInit } from 'src/app/schemas/socket_response/response';
import { Injectable, NestInterceptor, CallHandler } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class DuofinderInterceptor implements NestInterceptor {
    intercept(_, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            tap((data: DuoFinderResponseInit) => {
                if (data.notifications && data.notifications.length) {
                    data.notifications = data.notifications.map((n) => classToPlain(n));
                }

                return classToPlain(data);
            }),
        );
    }
}

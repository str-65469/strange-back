import { NestInterceptor, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class DuofinderInterceptor implements NestInterceptor {
    intercept(_: any, next: CallHandler): Observable<any>;
}

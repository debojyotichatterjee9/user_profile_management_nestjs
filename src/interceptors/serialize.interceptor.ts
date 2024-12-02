import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserListResponseDto } from 'src/user/dto/response.dtos/user.list.response.dto';

interface ClassConstructor {
  new (...args: any[]): object;
}

export function Serialize(customDto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(customDto));
}
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    /**
     * Run anything before the request is handeled by the request handler
     */
    return handler.handle().pipe(
      map((data: any) => {
        /**
         * Run anything before the response is sent our by the request handler
         */
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

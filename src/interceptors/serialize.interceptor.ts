import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { UserListResponseDto } from 'src/user/dto/response.dtos/user.list.response.dto';

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    /**
     * Run anything before the request is handeled by the request handler
     */
    console.log('>> ################################################## <<');
    return handler.handle().pipe(
      map((data: any) => {
        /**
         * Run anything before the response is sent our by the request handler
         */
        console.log('>> $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ <<');
        return plainToClass(UserListResponseDto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getHellos(): string {
    console.log('Delete this later');
    return 'Hello World!';
  }
}

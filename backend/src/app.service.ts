import { Injectable } from '@nestjs/common';

// nest generate service app (nest g s app)
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

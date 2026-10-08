import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      name: 'hei-blog API',
      version: '0.1.0',
      docs: '/docs',
    };
  }
}

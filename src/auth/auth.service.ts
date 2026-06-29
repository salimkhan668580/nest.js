import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getHello(): any {
    return {
      status: 'ok',
      message: 'api is success',
    };
  }
}

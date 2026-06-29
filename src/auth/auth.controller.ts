import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  postHello(): any {
    return this.authService.getHello();
  }

  //   @Get()
  //   getHello(): any {
  //     return this.authService.getHello('hello');
  //   }
}

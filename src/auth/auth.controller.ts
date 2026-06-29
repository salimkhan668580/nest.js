import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get()
  authHello(): string {
    return this.authService.getAuth();
  }

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      return await this.authService.register(createUserDto);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new BadRequestException('Email or phone already exists');
      }

      throw new InternalServerErrorException('Something went wrong')

    }
  }
}

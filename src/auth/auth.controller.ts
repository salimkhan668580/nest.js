import { AuthGuard } from './auth.guard';
import { Role } from './role.enum';
import { Body,Req, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, CreateUserDto, LoginDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  authHello(): string {
    return this.authService.getAuth();
  }

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    const userData: CreateUserDto = {
      ...createUserDto,
      password: hashPassword,
    };

    return await this.authService.register(userData);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('/change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
      @Req() req: any,

  ): Promise<any> {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new Error('Password does not match');
    }

    await this.authService.changePassword(changePasswordDto,req.user);
    return {
      success: true,
      message: 'Password changed successfully',
    };
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{
    success: boolean;
    message: string;
    token?: string;
  }> {
    const { token } = await this.authService.login(loginDto);

    return {
      success: true,
      message: 'Login successful',
      token,
    };
  }
}

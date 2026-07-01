import { AuthGuard } from "./auth.guard";
import { Role } from "./role.enum";
import {
  Body,
  Req,
  Controller,
  Get,
  Post,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ChangePasswordDto, CreateUserDto, LoginDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "./roles.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  authHello(): string {
    return this.authService.getAuth();
  }

  @Post("/register")
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
  @Post("/change-password")
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: any,
  ): Promise<any> {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException(
        "New password and confirm password do not match",
      );
    }

    await this.authService.changePassword(changePasswordDto, req.user);
    return {
      success: true,
      message: "Password changed successfully",
    };
  }

  @Post("/login")
  async login(@Body() loginDto: LoginDto): Promise<{
    success: boolean;
    message: string;
    token?: string;
  }> {
    const { token } = await this.authService.login(loginDto);

    return {
      success: true,
      message: "Login successful",
      token,
    };
  }

  @Post("/send-forget-otp")
  async sendForgetOtp(@Body() forgetDto: { email: string }): Promise<{
    success: boolean;
    message: string;
    otp?: number;
  }> {
    const otp = await this.authService.sendForgetOtp(forgetDto.email);

    return {
      success: true,
      message: "otp send successfully",
      otp,
    };
  }
  @Post("/verify-forget-otp")
  async verifyForgetOtp(
    @Body() verifyData: { email: string; otp: number },
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    await this.authService.verifyForgetOtp(verifyData);

    return {
      success: true,
      message: "otp send successfully",
    };
  }

  @Post("/ForgetPassword")
  async ForgetPassword(
    @Body()
    forgetData: {
      email: string;
      password: string;
      confirmPassword: string;
    },
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    if (forgetData.password === forgetData.confirmPassword) {
      throw new BadRequestException(
        "Password and confirm Password do not match",
      );
    }
    await this.authService.ForgetPassword(forgetData);

    return {
      success: true,
      message: "password has been changed successfully",
    };
  }
}

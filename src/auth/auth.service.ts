import { User } from "./schemas/user.schema";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ChangePasswordDto, CreateUserDto, LoginDto } from "./dto/register.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ForgetOtp } from "./schemas/forget.otp";
import e from "express";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(ForgetOtp.name) private forgetOtp: Model<ForgetOtp>,
    private jwtService: JwtService,
  ) {}
  getAuth(): string {
    return "This is auth first";
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);

      return await createdUser.save();
    } catch (error: unknown) {
      if (this.isDuplicateEmailError(error)) {
        throw new ConflictException("Email already exists");
      }

      throw new InternalServerErrorException();
    }
  }

  private isDuplicateEmailError(error: unknown): error is { code: number } {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code: number }).code === "number" &&
      (error as { code: number }).code === 11000
    );
  }
  async login(loginDto: LoginDto): Promise<{
    token: string;
    UserData: User;
  }> {
    const UserData = await this.userModel.findOne({
      email: loginDto.email,
    });

    if (!UserData) {
      throw new InternalServerErrorException("User not found");
    }

    const isMatch = await bcrypt.compare(loginDto.password, UserData?.password);

    if (!isMatch) {
      throw new UnauthorizedException("Password does not match");
    }

    const payload = { sub: UserData._id, username: UserData.email };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      UserData,
    };
  }
  async changePassword(
    changePasswordDto: ChangePasswordDto,
    user: any,
  ): Promise<void> {
    console.log(changePasswordDto);

    const UserData = await this.userModel.findById(user._id);
    if (!UserData) {
      throw new InternalServerErrorException("User not found");
    }

    const isMatch = bcrypt.compare(
      changePasswordDto.oldPassword,
      UserData?.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException("Password does not match");
    }
    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      saltOrRounds,
    );

    UserData.password = hashPassword;

    await UserData.save();
  }

  async sendForgetOtp(email: string): Promise<number> {
    if (!email) {
      throw new BadRequestException("Email is required");
    }
    const UserData = await this.userModel.findOne({ email });
    if (!UserData) {
      throw new NotFoundException("User not found");
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const paylod = {
      email: email,
      otp,
    };

    const forgetData = await this.forgetOtp.findOne({ email });
    if (!forgetData) {
      const createdUser = new this.forgetOtp(paylod);
      await createdUser.save();
    } else {
      forgetData.isVarified = false;
      forgetData.otp = String(otp);
      await forgetData.save();
    }

    return otp;
  }
  async verifyForgetOtp(verifyData: {
    email: string;
    otp: number;
  }): Promise<void> {
    console.log(verifyData);
    if (!verifyData.email || !verifyData.otp) {
      throw new BadRequestException("Email or Otp is required ");
    }
    const forgetData = await this.forgetOtp.findOne({
      email: verifyData.email,
      otp: String(verifyData.otp),
      isVarified: false,
    });
    if (!forgetData) {
      throw new BadRequestException("Invalid or Expired OTP");
    } else {
      forgetData.isVarified = true;
      await forgetData.save();
    }
  }

  async ForgetPassword(verifyData: {
    email: string;
    password: string;
  }): Promise<void> {
    if (!verifyData.email || !verifyData.password) {
      throw new BadRequestException("Email or Password is required ");
    }

    const forgetData = await this.forgetOtp.findOne({
      email: verifyData.email,
      isVarified: true,
    });
    if (!forgetData) {
      throw new BadRequestException("Invalid or Expired OTP");
    }

    const User = await this.userModel.findOne({ email: verifyData.email });
    if (!User) {
      throw new NotFoundException("user not found");
    }

    const hashPassword = await bcrypt.hash(verifyData.password, 10);
    User.password = hashPassword;
    await User.save();
  }
}

import { User } from "./schemas/user.schema";
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { ChangePasswordDto, CreateUserDto, LoginDto } from "./dto/register.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
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
  changePassword(changePasswordDto: ChangePasswordDto,user:any): void {
    console.log(changePasswordDto);

    console.log("user is in controller", user);
    // const saltOrRounds = 10;
    // const hashPassword = await bcrypt.hash(
    //   createUserDto.newPassword,
    //   saltOrRounds,
    // );
    // console.log("user",req.User)

    // const createdUser = new this.userModel(createUserDto);
    // return 'Password changed successfully';
    // return await createdUser.save();
  }
}

import { User } from './schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  getAuth(): string {
    return 'This is auth first';
  }
  async register(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }
}

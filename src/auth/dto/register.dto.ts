import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsString()
  street!: string;

  @IsString()
  city!: string;

  @IsString()
  state!: string;

  @IsNumber()
  pin!: number;
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  // Agar sirf India ka phone hai to IsPhoneNumber('IN')
  // warna string + IsString use karo
  @IsNumber()
  phone: number;

  @IsEnum(['male', 'female', 'other'])
  gender: 'male' | 'female' | 'other';

  @IsEnum(['user', 'admin'])
  role: 'user' | 'admin';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  address: AddressDto[];

  @IsBoolean()
  isDeleted?: boolean;

  @IsBoolean()
  isActive?: boolean;
}

export class ChangePasswordDto {
  @IsString()
  newPassword: string;

  @IsString()
  confirmPassword: string;

  @IsString()
  oldPassword: string;
}
export class LoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

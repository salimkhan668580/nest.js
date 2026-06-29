import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

class Address {
  street: string;
  city: string;
  state: string;
  pin: number;
}

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  phone: number;

  @Prop({ required: true, unique: true, enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop({
    required: true,
    unique: true,
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: string;

  @Prop({
    required: true,
    type: [
      {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pin: { type: Number, required: true },
      },
    ],
  })
  address: Address[];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: true })
  isActive: boolean;
  @Prop({ default: null })
  deactivatedAt: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

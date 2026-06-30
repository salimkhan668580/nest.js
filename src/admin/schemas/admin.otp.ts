import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class AdminOtp {
  @Prop()
  email: string;

  @Prop()
  otp: string;

  @Prop({ default: false })
  isVarified: boolean;

  @Prop({ default: Date.now, expires: 300 })
  createdAt: Date;
}

export const AdminOtpSchema = SchemaFactory.createForClass(AdminOtp);

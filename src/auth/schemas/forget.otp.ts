import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class forgetOtp {
  @Prop()
  email: string;

  @Prop()
  otp: string;

  @Prop({ default: false })
  isVarified: boolean;

  @Prop({ default: Date.now, expires: 300 })
  createdAt: Date;
}

export const forgetOtpSchema = SchemaFactory.createForClass(forgetOtp);

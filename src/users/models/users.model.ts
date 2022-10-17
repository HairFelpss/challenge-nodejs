import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../models/role.enum';

export type UserDocument = UserModel & Document;

@Schema({ timestamps: true })
export class UserModel {
  @Prop({ required: true, trim: true, unique: true })
  email: string;

  @Prop({ required: true })
  role: Role;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;

  @Prop({ default: null })
  lastLoginAt?: Date | null;

  @Prop({ trim: true })
  hash?: string;

  @Prop({ trim: true })
  hashedRt?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);

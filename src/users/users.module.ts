import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UserSchema } from './models/users.model';
import { AuthHelper } from 'src/auth/helpers/auth.helper';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: UserSchema }])],
  controllers: [UsersController],
  providers: [
    AuthService,
    ConfigService,
    UsersRepository,
    UsersService,
    AuthHelper,
    JwtService,
  ],
})
export class UsersModule {}

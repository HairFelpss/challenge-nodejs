import { AuthModule } from 'src/auth/auth.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UserSchema } from './models/users.model';
import { AuthHelper } from 'src/auth/helpers/auth.helper';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

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

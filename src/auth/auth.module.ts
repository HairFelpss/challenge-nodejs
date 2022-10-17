import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { UsersModule } from 'src/users/users.module';
import { UserSchema } from 'src/users/models/users.model';
import { UsersRepository } from 'src/users/users.repository';

import { ConfigService } from '@nestjs/config';
import { AuthHelper } from './helpers/auth.helper';
import { UsersService } from 'src/users/users.service';
import { AccessTokenStrategy } from './strategies/access-token';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '60s' },
    }),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    UsersRepository,
    AuthHelper,
    UsersService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}

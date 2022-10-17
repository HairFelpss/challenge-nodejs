import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as argon from 'argon2';

import { AuthenticateDto } from './dto/authenticate.dto';
import { UserNotAuthorizedException } from './exceptions/user-not-authorized.exception';
import { AuthHelper } from './helpers/auth.helper';
import { JwtPayload } from './types/jwtPayload.type';
import { AuthenticateResponseDto } from './dto/authenticate-response.dto';

import { PasswordInvalidException } from 'src/users/exceptions/password-invalid-exception';
import { UserDontExistException } from 'src/users/exceptions/user-dont-exist-exceptions';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authHelper: AuthHelper,
    private config: ConfigService,
  ) {}

  async login({
    email,
    password,
  }: AuthenticateDto): Promise<AuthenticateResponseDto> {
    const user = await this.usersRepository.getUser({ email }, [
      'password',
      'email',
      '_id',
      'role',
      'hashedRt',
    ]);

    if (!user) throw new UserDontExistException();

    const passwordMatches = this.authHelper.isPasswordValid(
      user.password,
      password,
    );

    if (!passwordMatches) throw new PasswordInvalidException();

    const tokens = await this.getTokens(user['_id'], user.email, user.role);
    await this.updateRtHash(user['_id'], tokens.refresh_token);

    return tokens;
  }

  async logout(email: string): Promise<boolean> {
    const user = await this.usersRepository.getUser({ email }, [
      'hashedRt',
      'email',
      '_id',
    ]);

    if (!user) throw new UserDontExistException();

    await this.usersRepository.getUserAndUpdate(
      { email: email },
      { hashedRt: null },
      [],
    );

    return true;
  }

  async refreshTokens(
    email: string,
    rt: string,
  ): Promise<AuthenticateResponseDto> {
    const user = await this.usersRepository.getUser({ email }, [
      'password',
      'email',
      '_id',
      'role',
    ]);

    if (!user) throw new UserDontExistException();

    const rtMatches = await argon.verify(user.hashedRt, rt);
    if (!rtMatches) throw new UserNotAuthorizedException();

    const tokens = await this.getTokens(user['_id'], user.email, user.role);
    await this.updateRtHash(user['_id'], tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(email: string, rt: string): Promise<void> {
    const hash = await argon.hash(rt);

    if (!hash) throw new UserNotAuthorizedException();

    await this.usersRepository.getUserAndUpdate(
      { email },
      { hashedRt: hash },
      [],
    );
  }

  async getTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<AuthenticateResponseDto> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
      role,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.authHelper.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '15m',
      }),
      this.authHelper.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}

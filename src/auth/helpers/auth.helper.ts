import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcryptjs';

import { UserModel } from 'src/users/models/users.model';
import { JwtPayload } from '../types/jwtPayload.type';

@Injectable()
export class AuthHelper {
  constructor(private readonly jwt: JwtService) {}

  // Decoding the JWT Token
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  // Generate JWT Token
  public generateToken(user: UserModel): string {
    return this.jwt.sign({
      id: user['_id'],
      email: user.email,
      role: user.role,
    });
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(userPassword, password);
  }

  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  public signAsync(
    jwtPayload: JwtPayload,
    { secret, expiresIn }: { secret: string; expiresIn: string },
  ): Promise<string> {
    return this.jwt.signAsync(jwtPayload, { secret, expiresIn });
  }
}

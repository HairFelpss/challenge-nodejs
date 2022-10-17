import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { UserModel, UserDocument } from './models/users.model';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthHelper } from 'src/auth/helpers/auth.helper';

@Injectable()
export class UsersRepository {
  @Inject(AuthHelper) private readonly authHelper: AuthHelper;

  constructor(
    @InjectModel('user') private readonly userModel: Model<UserDocument>,
  ) {}
  async createUser(user: UserModel): Promise<UserModel> {
    const userExists = await this.getUser({ email: user.email }, ['email']);

    if (userExists) return;

    const password = this.authHelper.encodePassword(user.password);

    delete user.password;

    user.password = password;

    return this.userModel.create(user);
  }

  async getUser(query: object, fields: string[]): Promise<UserModel> {
    return this.userModel.findOne(query).select(fields);
  }

  async getUsers(query: object, fields: string[]): Promise<User[]> {
    return this.userModel.find(query).select(fields);
  }

  async getUserAndUpdate(
    query: object,
    user: UpdateUserDto,
    fields: string[],
  ): Promise<User> {
    return this.userModel
      .findOneAndUpdate(query, { updatedAt: Date.now(), ...user })
      .select(fields);
  }

  async deleteUser(query: object): Promise<any> {
    return this.userModel.deleteOne(query);
  }
}

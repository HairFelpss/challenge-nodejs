import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { UsersRepository } from './users.repository';

import { User } from './entities/user.entity';
import { UserRegister } from './entities/user-register.entity';

import { UserModel } from './models/users.model';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserExistsException } from './exceptions/user-exist-exceptions';
import { UserDontExistException } from './exceptions/user-dont-exist-exceptions';

import { UserNotAuthorizedException } from 'src/auth/exceptions/user-not-authorized.exception';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async create(createUserDto: CreateUserDto): Promise<UserRegister> {
    const { email, role } = createUserDto;

    const password = await argon.hash(new Date().toString());

    const createdUser = await this.usersRepository.createUser({
      email,
      password,
      role,
    });

    if (!createdUser) throw new UserExistsException();

    return { email: createdUser.email, password };
  }

  findAll(): Promise<User[]> {
    const users = this.usersRepository.getUsers({}, ['email', 'role', '_id']);

    if (!users) throw new UserNotAuthorizedException();

    return users;
  }

  async findOne(param: string): Promise<UserModel> {
    const user = await this.usersRepository.getUser(
      {
        [param]: param,
      },
      ['email', 'role', '_id'],
    );

    if (!user) throw new UserDontExistException();

    return user;
  }

  async update(email: string, updateUser: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.getUserAndUpdate(
      { email },
      updateUser,
      ['email', 'role', '_id'],
    );

    if (!user) throw new UserDontExistException();

    return user;
  }

  async deleteUser(email: string) {
    const { deletedCount }: { deletedCount: number } =
      await this.usersRepository.deleteUser({
        email,
      });

    if (deletedCount === 0) throw new UserDontExistException();

    if (deletedCount === 1) return true;
  }
}

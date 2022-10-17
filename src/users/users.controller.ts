import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

import { User } from './entities/user.entity';
import { UserRegister } from './entities/user-register.entity';

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { PasswordInvalidException } from './exceptions/password-invalid-exception';
import { UserDontExistException } from './exceptions/user-dont-exist-exceptions';

import { UserNotAuthorizedException } from 'src/auth/exceptions/user-not-authorized.exception';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Users')
@Controller()
@ApiException(() => UserNotAuthorizedException, {
  description: 'User is not authorized',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @ApiOperation({ summary: 'Create a new user.' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: UserRegister,
  })
  @ApiException(() => [PasswordInvalidException, UserNotAuthorizedException])
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Return a list of all users.' })
  @ApiCreatedResponse({
    description: 'Return a list of all users.',
    type: [User],
  })
  @ApiException(() => UserNotAuthorizedException)
  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Return a specific user.' })
  @ApiCreatedResponse({
    description: 'Return a specific user.',
    type: User,
  })
  @ApiException(() => [UserDontExistException, UserNotAuthorizedException])
  @Get('users/:email')
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a specific user.' })
  @ApiCreatedResponse({
    description: 'Update a specific user.',
    type: User,
  })
  @ApiException(() => [UserDontExistException, UserNotAuthorizedException])
  @Patch('users/:email')
  async update(
    @Param('email') email: string,
    @Body() updateUser: UpdateUserDto,
  ) {
    return this.usersService.update(email, updateUser);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete an specific user.' })
  @ApiCreatedResponse({
    description: 'Delete a specific user.',
  })
  @ApiException(() => [UserDontExistException, UserNotAuthorizedException])
  @Delete('users/:email')
  deleteUsers(@Param('email') email: string) {
    return this.usersService.deleteUser(email);
  }
}

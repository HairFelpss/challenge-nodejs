import { BadRequestException } from '@nestjs/common';

export class UserDontExistException extends BadRequestException {
  constructor() {
    super('User does not exists!');
  }
}

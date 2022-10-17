import { BadRequestException } from '@nestjs/common';

export class UserExistsException extends BadRequestException {
  constructor() {
    super('The user already exists!');
  }
}

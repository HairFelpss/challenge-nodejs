import { BadRequestException } from '@nestjs/common';

export class PasswordInvalidException extends BadRequestException {
  constructor() {
    super('The password was invalid');
  }
}

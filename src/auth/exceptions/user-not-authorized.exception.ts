import { UnauthorizedException } from '@nestjs/common';

export class UserNotAuthorizedException extends UnauthorizedException {
  constructor() {
    super('The user is not authorized');
  }
}

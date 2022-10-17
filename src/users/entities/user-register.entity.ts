import { ApiProperty } from '@nestjs/swagger';

export class UserRegister {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

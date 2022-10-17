import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  _id: string;
}

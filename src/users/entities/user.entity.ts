import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  email: string;

  @ApiProperty()
  roles: string[];

  @ApiProperty()
  _id: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../models/role.enum';

export class User {
  @ApiProperty()
  email: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  _id: string;
}

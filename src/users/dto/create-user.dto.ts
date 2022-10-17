import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsArray()
  readonly roles: string[];
}

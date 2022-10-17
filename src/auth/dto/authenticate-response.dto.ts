import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly access_token: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly refresh_token: string;
}

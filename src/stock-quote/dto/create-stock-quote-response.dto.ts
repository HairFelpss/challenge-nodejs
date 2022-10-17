import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateStockQuoteResponseDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly symbol: string;

  @ApiProperty()
  @IsNumber()
  readonly open: number;

  @ApiProperty()
  @IsNumber()
  readonly high: number;

  @ApiProperty()
  @IsNumber()
  readonly low: number;

  @ApiProperty()
  @IsNumber()
  readonly close: number;

  @ApiProperty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsString()
  readonly time: string;

  @ApiProperty()
  @IsNumber()
  readonly volume: number;

  @ApiProperty()
  @IsString()
  readonly userId?: string;
}

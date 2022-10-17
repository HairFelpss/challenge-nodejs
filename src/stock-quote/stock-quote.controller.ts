import {
  Controller,
  Get,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

import { StockQuoteService } from './stock-quote.service';

import { Public } from 'src/common/decorators/public.decorator';
import { StockQuoteEntity } from './entities/stock-quote.entity';

import { Role } from 'src/users/models/role.enum';
import { HasRoles } from 'src/common/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('Stock Quote')
@Controller('stock-quote')
export class StockQuoteController {
  constructor(private readonly stockQuoteService: StockQuoteService) {}

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('history')
  findAll() {
    return this.stockQuoteService.findAll();
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('stats')
  findAllStats() {
    return this.stockQuoteService.stats();
  }

  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Retrieve and save a stock quote.' })
  @ApiException(() => BadRequestException)
  @ApiCreatedResponse({
    description: 'Stock quote informations saved!',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':stock_code/:userId')
  async findOne(
    @Param('stock_code') param: string,
    @Param('userId') userId: string,
  ): Promise<StockQuoteEntity> {
    const { name, symbol, open, high, low, close } =
      await this.stockQuoteService.findOne(param, userId);

    return { name, symbol, open, high, low, close, userId };
  }
}

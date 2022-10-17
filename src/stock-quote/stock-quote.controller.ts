import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { StockQuoteService } from './stock-quote.service';
import { CreateStockQuoteDto } from './dto/create-stock-quote.dto';
import { UpdateStockQuoteDto } from './dto/update-stock-quote.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateStockQuoteResponseDto } from './dto/create-stock-quote-response.dto';
import { StockQuoteEntity } from './entities/stock-quote.entity';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

@ApiTags('Stock Quote')
@Controller('stock-quote')
export class StockQuoteController {
  constructor(private readonly stockQuoteService: StockQuoteService) {}

  @Post()
  create(@Body() createStockQuoteDto: CreateStockQuoteDto) {
    return this.stockQuoteService.create(createStockQuoteDto);
  }

  @Public()
  @Get('history')
  findAll() {
    return this.stockQuoteService.findAll();
  }

  @Public()
  @Get('stats')
  findAllStats() {
    return this.stockQuoteService.findAll();
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStockQuoteDto: UpdateStockQuoteDto,
  ) {
    return this.stockQuoteService.update(+id, updateStockQuoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockQuoteService.remove(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { StockQuoteService } from './stock-quote.service';
import { CreateStockQuoteDto } from './dto/create-stock-quote.dto';
import { UpdateStockQuoteDto } from './dto/update-stock-quote.dto';

@ApiTags('Stock Quote')
@Controller('stock-quote')
export class StockQuoteController {
  constructor(private readonly stockQuoteService: StockQuoteService) {}

  @Post()
  create(@Body() createStockQuoteDto: CreateStockQuoteDto) {
    return this.stockQuoteService.create(createStockQuoteDto);
  }

  @Get()
  findAll() {
    return this.stockQuoteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockQuoteService.findOne(+id);
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

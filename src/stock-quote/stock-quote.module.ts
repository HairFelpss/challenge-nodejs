import { Module } from '@nestjs/common';
import { StockQuoteService } from './stock-quote.service';
import { StockQuoteController } from './stock-quote.controller';

@Module({
  controllers: [StockQuoteController],
  providers: [StockQuoteService]
})
export class StockQuoteModule {}

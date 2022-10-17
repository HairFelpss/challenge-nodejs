import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateStockQuoteResponseDto } from './dto/create-stock-quote-response.dto';
import { CreateStockQuoteDto } from './dto/create-stock-quote.dto';

import { StockQuoteRepository } from './stock-quote.repository';

@Injectable()
export class StockQuoteService {
  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
    private readonly stockQuoteRepository: StockQuoteRepository,
  ) {}

  create(userId: string, symbols: CreateStockQuoteResponseDto) {
    return this.stockQuoteRepository.createStockQuote({
      userId,
      ...symbols,
    });
  }

  findAll() {
    return this.stockQuoteRepository.getStockQuotes({});
  }

  async stats() {
    const response = await this.stockQuoteRepository.getStockQuotesAgg();

    return response.map((res) => ({
      stock: res['_id'].stock,
      times_requested: res['times_requested'],
    }));
  }

  async findOne(stock_code: string): Promise<CreateStockQuoteResponseDto> {
    const response = await this.httpService
      .get(
        `${this.config.get<string>(
          'API_URL',
        )}/?s=${stock_code}&f=sd2t2ohlcvn&h&e=json`,
      )
      .toPromise();

    const { symbols }: CreateStockQuoteDto = response.data;

    return symbols[0];
  }
}

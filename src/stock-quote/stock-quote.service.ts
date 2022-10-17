import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateStockQuoteDto } from './dto/create-stock-quote.dto';
import { UpdateStockQuoteDto } from './dto/update-stock-quote.dto';
import { StockQuoteEntity } from './entities/stock-quote.entity';
import { StockQuoteModel } from './models/stock-quote.model';
import { StockQuoteRepository } from './stock-quote.repository';

@Injectable()
export class StockQuoteService {
  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
    private readonly stockQuoteRepository: StockQuoteRepository,
  ) {}

  create(createStockQuoteDto: CreateStockQuoteDto) {
    return 'This action adds a new stockQuote';
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

  async findOne(stock_code: string, userId: string): Promise<StockQuoteModel> {
    const response = await this.httpService
      .get(
        `${this.config.get<string>(
          'API_URL',
        )}/?s=${stock_code}&f=sd2t2ohlcvn&h&e=json`,
      )
      .toPromise();

    const { symbols }: CreateStockQuoteDto = response.data;

    return this.stockQuoteRepository.createStockQuote({
      userId,
      ...symbols[0],
    });
  }

  update(id: number, updateStockQuoteDto: UpdateStockQuoteDto) {
    return `This action updates a #${id} stockQuote`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockQuote`;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { StockQuoteModel, StockQuotDocument } from './models/stock-quote.model';
import { CreateStockQuoteResponseDto } from './dto/create-stock-quote-response.dto';
import { StockQuoteEntity } from './entities/stock-quote.entity';

@Injectable()
export class StockQuoteRepository {
  constructor(
    @InjectModel('stock-quote')
    private readonly stockQuoteModel: Model<StockQuotDocument>,
  ) {}
  async createStockQuote(
    stockQuote: CreateStockQuoteResponseDto,
  ): Promise<StockQuoteModel> {
    delete stockQuote.date;

    return this.stockQuoteModel.create(stockQuote);
  }

  async getStockQuotes(query: object): Promise<StockQuoteModel[]> {
    return this.stockQuoteModel.find(query).sort({ date: -1 });
  }

  async getStockQuotesAgg(): Promise<StockQuoteModel[]> {
    return this.stockQuoteModel
      .aggregate()
      .group({
        _id: {
          stock: '$symbol',
        },
        times_requested: {
          $sum: 1,
        },
      })
      .sort({ times_requested: -1 })
      .limit(5);
  }

  async deleteUser(query: object): Promise<any> {
    return this.stockQuoteModel.deleteOne(query);
  }
}

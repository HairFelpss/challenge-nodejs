import { Injectable } from '@nestjs/common';
import { CreateStockQuoteDto } from './dto/create-stock-quote.dto';
import { UpdateStockQuoteDto } from './dto/update-stock-quote.dto';

@Injectable()
export class StockQuoteService {
  create(createStockQuoteDto: CreateStockQuoteDto) {
    return 'This action adds a new stockQuote';
  }

  findAll() {
    return `This action returns all stockQuote`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockQuote`;
  }

  update(id: number, updateStockQuoteDto: UpdateStockQuoteDto) {
    return `This action updates a #${id} stockQuote`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockQuote`;
  }
}

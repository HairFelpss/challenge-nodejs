import { Test, TestingModule } from '@nestjs/testing';
import { StockQuoteService } from './stock-quote.service';

describe('StockQuoteService', () => {
  let service: StockQuoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockQuoteService],
    }).compile();

    service = module.get<StockQuoteService>(StockQuoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

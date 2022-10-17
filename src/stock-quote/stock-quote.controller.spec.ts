import { Test, TestingModule } from '@nestjs/testing';
import { StockQuoteController } from './stock-quote.controller';
import { StockQuoteService } from './stock-quote.service';

describe('StockQuoteController', () => {
  let controller: StockQuoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockQuoteController],
      providers: [StockQuoteService],
    }).compile();

    controller = module.get<StockQuoteController>(StockQuoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

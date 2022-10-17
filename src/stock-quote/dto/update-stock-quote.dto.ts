import { PartialType } from '@nestjs/swagger';
import { CreateStockQuoteDto } from './create-stock-quote.dto';

export class UpdateStockQuoteDto extends PartialType(CreateStockQuoteDto) {}

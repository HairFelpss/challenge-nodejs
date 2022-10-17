import { Exclude } from 'class-transformer';

export class StockQuoteEntity {
  userId: string;

  name: string;

  symbol: string;

  open: number;

  high: number;

  low: number;

  close: number;

  @Exclude()
  date?: string;

  @Exclude()
  time?: string;

  @Exclude()
  volume?: number;
}

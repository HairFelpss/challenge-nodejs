import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StockQuotDocument = StockQuoteModel & Document;

@Schema()
export class StockQuoteModel {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  symbol: string;

  @Prop({ required: true })
  open: number;

  @Prop({ required: true })
  high: number;

  @Prop({ required: true })
  low: number;

  @Prop({ required: true })
  close: number;

  @Prop({ default: Date.now() })
  date: Date;

  @Prop()
  volume: number;

  @Prop({ required: true, trim: true })
  userId: string;
}

export const StockQuoteSchema = SchemaFactory.createForClass(StockQuoteModel);

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { StockQuoteService } from './stock-quote.service';
import { StockQuoteController } from './stock-quote.controller';
import { StockQuoteSchema } from './models/stock-quote.model';
import { StockQuoteRepository } from './stock-quote.repository';
import { UsersRepository } from 'src/users/users.repository';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { AuthHelper } from 'src/auth/helpers/auth.helper';
import { JwtService } from '@nestjs/jwt';
import { UserSchema } from 'src/users/models/users.model';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    MongooseModule.forFeature([
      { name: 'stock-quote', schema: StockQuoteSchema },
      { name: 'user', schema: UserSchema },
    ]),
  ],
  controllers: [StockQuoteController],
  providers: [
    StockQuoteService,
    StockQuoteRepository,
    AuthService,
    ConfigService,
    UsersRepository,
    UsersService,
    AuthHelper,
    JwtService,
  ],
})
export class StockQuoteModule {}

import { Module } from '@nestjs/common';
import { PublicOrdersController } from './public-orders.controller';
import { PublicOrdersService } from './public-orders.service';
import { PublicShopsController } from './public-shops.controller';
import { PublicShopsService } from './public-shops.service';

@Module({
  controllers: [PublicShopsController, PublicOrdersController],
  providers: [PublicShopsService, PublicOrdersService],
})
export class PublicModule {}

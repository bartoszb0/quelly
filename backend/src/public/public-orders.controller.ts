import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import type { UUID } from 'crypto';
import { PublicOrdersService } from './public-orders.service';

@Controller('public/shops/:shopPublicId/orders')
export class PublicOrdersController {
  constructor(private readonly publicOrdersService: PublicOrdersService) {}

  @Get(':number')
  findOrder(
    @Param('shopPublicId', ParseUUIDPipe) shopPublicId: UUID,
    @Param('number', ParseIntPipe) number: number,
  ) {
    return this.publicOrdersService.findOrder(shopPublicId, number);
  }
}

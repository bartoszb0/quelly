import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import type { UUID } from 'crypto';
import { PublicShopsService } from './public-shops.service';

@Controller('public/shops')
export class PublicShopsController {
  constructor(private readonly publicShopsService: PublicShopsService) {}

  @Get(':shopPublicId')
  findShop(@Param('shopPublicId', ParseUUIDPipe) shopPublicId: UUID) {
    return this.publicShopsService.findShop(shopPublicId);
  }
}

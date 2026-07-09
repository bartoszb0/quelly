import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import type { UUID } from 'crypto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserPayload } from '../common/types/user-payload.type';
import { AnalyticsService } from './analytics.service';

@Controller('shops/:shopId/analytics')
@UseGuards(JwtGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  findAll(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.analyticsService.findAll(shopId, user.id);
  }
}

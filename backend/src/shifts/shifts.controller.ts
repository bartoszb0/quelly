import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { UUID } from 'crypto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserPayload } from '../common/types/user-payload.type';
import { ShiftsService } from './shifts.service';

@Controller('shops/:shopId/shifts')
@UseGuards(JwtGuard)
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get('active')
  getActive(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.shiftsService.getActive(shopId, user.id);
  }

  @Post('start')
  start(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.shiftsService.start(shopId, user.id);
  }

  @Post('end')
  end(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.shiftsService.end(shopId, user.id);
  }

  @Get()
  findAll(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.shiftsService.findAll(shopId, user.id);
  }

  @Get(':id')
  findOne(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
    @Param('id', ParseUUIDPipe) id: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.shiftsService.findOne(shopId, id, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
    @Param('id', ParseUUIDPipe) id: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.shiftsService.remove(shopId, id, user.id);
  }
}

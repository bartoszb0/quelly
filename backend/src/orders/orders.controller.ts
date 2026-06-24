import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { UUID } from 'crypto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserPayload } from '../common/types/user-payload.type';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@Controller('/shops/:shopId/orders')
@UseGuards(JwtGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.ordersService.create(shopId, createOrderDto, user.id);
  }

  @Post(':id/ready')
  markReady(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
    @Param('id', ParseUUIDPipe) id: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.ordersService.markReady(shopId, id, user.id);
  }

  @Post(':id/collected')
  markCollected(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
    @Param('id', ParseUUIDPipe) id: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.ordersService.markCollected(shopId, id, user.id);
  }

  @Post(':id/cancelled')
  markCancelled(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
    @Param('id', ParseUUIDPipe) id: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.ordersService.markCancelled(shopId, id, user.id);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}

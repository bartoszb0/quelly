import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItemsService } from './menu-items.service';

@Controller('shops/:shopId/menu-items')
@UseGuards(JwtGuard)
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  create(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
    @Body() createMenuItemDto: CreateMenuItemDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.menuItemsService.create(shopId, createMenuItemDto, user.id);
  }

  @Get()
  findAll(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.menuItemsService.findAll(shopId, user.id);
  }

  @Get(':id')
  findOne(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
    @Param('id', ParseUUIDPipe) id: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.menuItemsService.findOne(shopId, id, user.id);
  }

  @Patch(':id')
  update(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.menuItemsService.update(shopId, id, updateMenuItemDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
    @Param('id', ParseUUIDPipe) id: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.menuItemsService.remove(shopId, id, user.id);
  }
}

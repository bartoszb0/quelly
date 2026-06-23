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
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopsService } from './shops.service';

@Controller('shops')
@UseGuards(JwtGuard)
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  create(
    @Body() createShopDto: CreateShopDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.shopsService.create(createShopDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    return this.shopsService.findAll(user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.shopsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateShopDto: UpdateShopDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.shopsService.update(id, updateShopDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseUUIDPipe) id: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.shopsService.remove(id, user.id);
  }
}

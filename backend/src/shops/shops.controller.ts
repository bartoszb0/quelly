import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  StreamableFile,
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

  @Get(':id/qr')
  @Header('Content-Type', 'image/png')
  @Header('Content-Disposition', 'attachment; filename="quelly-qr.png"')
  async getQrCode(
    @Param('id', ParseUUIDPipe) id: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    const png = await this.shopsService.getQrCode(id, user.id);
    return new StreamableFile(png);
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

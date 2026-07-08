import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShopsService } from '../shops/shops.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly shopsService: ShopsService,
  ) {}

  async create(
    shopId: string,
    createMenuItemDto: CreateMenuItemDto,
    userId: string,
  ) {
    await this.shopsService.findOne(shopId, userId);

    // Place new items at the end of the menu.
    const { _max } = await this.prisma.menuItem.aggregate({
      where: { shopId: shopId },
      _max: { sortOrder: true },
    });

    return this.prisma.menuItem.create({
      data: {
        name: createMenuItemDto.name,
        shopId: shopId,
        sortOrder: (_max.sortOrder ?? -1) + 1,
      },
    });
  }

  async findAll(shopId: string, userId: string) {
    await this.shopsService.findOne(shopId, userId);
    return this.prisma.menuItem.findMany({
      where: {
        shopId: shopId,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(shopId: string, id: string, userId: string) {
    await this.shopsService.findOne(shopId, userId);
    const menuItem = await this.prisma.menuItem.findFirst({
      where: {
        id: id,
        shopId: shopId,
      },
    });

    if (!menuItem) throw new NotFoundException('Could not find this menu item');

    return menuItem;
  }

  async update(
    shopId: string,
    id: string,
    updateMenuItemDto: UpdateMenuItemDto,
    userId: string,
  ) {
    await this.findOne(shopId, id, userId);
    return this.prisma.menuItem.update({
      where: {
        id: id,
        shopId: shopId,
      },
      data: {
        name: updateMenuItemDto.name,
      },
    });
  }

  async remove(shopId: string, id: string, userId: string) {
    await this.findOne(shopId, id, userId);
    await this.prisma.menuItem.delete({
      where: {
        id: id,
        shopId: shopId,
      },
    });
  }
}

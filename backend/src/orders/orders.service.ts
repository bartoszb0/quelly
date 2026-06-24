import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShiftsService } from '../shifts/shifts.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly shiftsService: ShiftsService,
  ) {}

  private async getNextNumber(shiftId: string) {
    const latestOrder = await this.prisma.order.findFirst({
      where: {
        shiftId: shiftId,
      },
      orderBy: { number: 'desc' },
    });

    return !latestOrder ? 1 : latestOrder.number + 1;
  }

  async create(shopId: string, createOrderDto: CreateOrderDto, userId: string) {
    const shift = await this.shiftsService.getActiveOrThrow(shopId, userId);

    let orderItems: {
      menuItemId: string;
      quantity: number;
      nameSnapshot: string;
    }[] = [];

    if (createOrderDto.items) {
      const itemIds = createOrderDto.items.map((i) => i.menuItemId);

      const menuItems = await this.prisma.menuItem.findMany({
        where: { id: { in: itemIds }, shopId },
      });

      if (menuItems.length !== new Set(itemIds).size)
        throw new BadRequestException('One or more menu items are invalid');

      orderItems = createOrderDto.items.map((dtoItem) => {
        const menuItem = menuItems.find((mi) => mi.id === dtoItem.menuItemId);

        return {
          menuItemId: dtoItem.menuItemId,
          quantity: dtoItem.quantity,
          nameSnapshot: menuItem!.name,
        };
      });
    }

    const number = await this.getNextNumber(shift.id);

    return this.prisma.order.create({
      data: {
        shopId: shopId,
        shiftId: shift.id,
        number: number,
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });
  }

  findAll() {
    return `This action returns all orders`;
  }

  async findOrderInActiveShift(shopId: string, id: string, userId: string) {
    const shift = await this.shiftsService.getActiveOrThrow(shopId, userId);

    const order = await this.prisma.order.findFirst({
      where: {
        shiftId: shift.id,
        id: id,
      },
    });

    if (!order) throw new NotFoundException('Could not find this order');

    return order;
  }

  async markReady(shopId: string, id: string, userId: string) {
    const order = await this.findOrderInActiveShift(shopId, id, userId);

    if (order.status !== 'QUEUED')
      throw new BadRequestException('Status is not valid');

    return this.prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: 'READY',
        readyAt: new Date(),
      },
    });
  }

  async markCollected(shopId: string, id: string, userId: string) {
    const order = await this.findOrderInActiveShift(shopId, id, userId);

    if (order.status !== 'READY')
      throw new BadRequestException('Status is not valid');

    return this.prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: 'COLLECTED',
        collectedAt: new Date(),
      },
    });
  }

  async markCancelled(shopId: string, id: string, userId: string) {
    const order = await this.findOrderInActiveShift(shopId, id, userId);

    if (order.status === 'COLLECTED' || order.status === 'CANCELLED')
      throw new BadRequestException('Status is not valid');

    return this.prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: 'CANCELLED',
      },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

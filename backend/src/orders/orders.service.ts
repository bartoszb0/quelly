import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { ShiftsService } from '../shifts/shifts.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly shiftsService: ShiftsService,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  private async getNextNumber(shiftId: string): Promise<number> {
    const MAX = 99;

    const latestOrder = await this.prisma.order.findFirst({
      where: { shiftId },
      orderBy: { createdAt: 'desc' },
      select: { number: true },
    });

    let candidate = !latestOrder ? 1 : (latestOrder.number % MAX) + 1;

    let attempts = 0;

    while (
      await this.prisma.order.findFirst({
        where: {
          shiftId,
          number: candidate,
          status: { in: ['QUEUED', 'READY'] },
        },
      })
    ) {
      candidate = (candidate % MAX) + 1;
      attempts++;

      if (attempts >= MAX) {
        throw new ConflictException(
          'The active shift already has the maximum number of active orders.',
        );
      }
    }

    return candidate;
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

  async findOrderInActiveShift(shopId: string, id: string, userId: string) {
    const shift = await this.shiftsService.getActiveOrThrow(shopId, userId);

    const order = await this.prisma.order.findFirst({
      where: {
        shiftId: shift.id,
        id: id,
      },
      include: {
        shop: {
          select: {
            publicId: true,
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Could not find this order');

    return order;
  }

  async markReady(shopId: string, id: string, userId: string) {
    const order = await this.findOrderInActiveShift(shopId, id, userId);

    if (order.status !== 'QUEUED')
      throw new BadRequestException('Status is not valid');

    const updatedOrder = await this.prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: 'READY',
        readyAt: new Date(),
      },
    });

    this.realtimeGateway.notifyQueueChange(order.shop.publicId);

    return updatedOrder;
  }

  async markCollected(shopId: string, id: string, userId: string) {
    const order = await this.findOrderInActiveShift(shopId, id, userId);

    if (order.status !== 'READY')
      throw new BadRequestException('Status is not valid');

    const updatedOrder = await this.prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: 'COLLECTED',
        collectedAt: new Date(),
      },
    });

    this.realtimeGateway.notifyQueueChange(order.shop.publicId);

    return updatedOrder;
  }

  async markCancelled(shopId: string, id: string, userId: string) {
    const order = await this.findOrderInActiveShift(shopId, id, userId);

    if (order.status === 'COLLECTED' || order.status === 'CANCELLED')
      throw new BadRequestException('Status is not valid');

    const updatedOrder = await this.prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: 'CANCELLED',
      },
    });

    this.realtimeGateway.notifyQueueChange(order.shop.publicId);

    return updatedOrder;
  }
}

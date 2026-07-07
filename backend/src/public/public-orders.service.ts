import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrder(shopPublicId: string, number: number) {
    const shop = await this.prisma.shop.findUnique({
      where: {
        publicId: shopPublicId,
      },
    });

    if (!shop) throw new NotFoundException('Could not find that shop');

    const shift = await this.prisma.shift.findFirst({
      where: {
        shopId: shop.id,
        endedAt: null,
      },
    });

    if (!shift) throw new NotFoundException('Could not find that shop');

    const order = await this.prisma.order.findFirst({
      where: {
        shopId: shop.id,
        shiftId: shift.id,
        number: number,
      },
      select: {
        number: true,
        status: true,
        createdAt: true,
        items: {
          select: {
            nameSnapshot: true,
            quantity: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!order) throw new NotFoundException('Could not find that order');

    let ordersInQueue: number | null = null;

    if (order.status === 'QUEUED') {
      ordersInQueue = await this.prisma.order.count({
        where: {
          shiftId: shift.id,
          status: 'QUEUED',
          createdAt: { lt: order.createdAt },
        },
      });
    }

    return {
      ...order,
      ordersInQueue: ordersInQueue,
    };
  }
}

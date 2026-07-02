import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShopsService } from '../shops/shops.service';

@Injectable()
export class ShiftsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly shopsService: ShopsService,
  ) {}

  async getActive(shopId: string, userId: string) {
    await this.shopsService.findOne(shopId, userId);

    return this.prisma.shift.findFirst({
      where: {
        shopId: shopId,
        endedAt: null,
      },
    });
  }

  async getActiveOrThrow(shopId: string, userId: string) {
    const shift = await this.getActive(shopId, userId);
    if (!shift)
      throw new BadRequestException('There is no active shift currently');
    return shift;
  }

  async start(shopId: string, userId: string) {
    const currentlyActive = await this.getActive(shopId, userId);

    if (currentlyActive !== null)
      throw new ConflictException('There is an active shift already');

    return this.prisma.shift.create({
      data: {
        shopId: shopId,
      },
    });
  }

  async end(shopId: string, userId: string) {
    const currentlyActive = await this.getActiveOrThrow(shopId, userId);

    await this.prisma.order.updateMany({
      where: {
        shiftId: currentlyActive.id,
        status: { in: ['QUEUED', 'READY'] },
      },
      data: {
        status: 'CANCELLED',
      },
    });

    return this.prisma.shift.update({
      data: {
        endedAt: new Date(),
      },
      where: {
        id: currentlyActive.id,
      },
    });
  }

  async findAll(shopId: string, userId: string) {
    await this.shopsService.findOne(shopId, userId);

    const shifts = await this.prisma.shift.findMany({
      where: {
        shopId: shopId,
      },
      orderBy: {
        startedAt: 'desc',
      },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    return shifts.map(({ _count, ...shift }) => ({
      ...shift,
      ordersCount: _count.orders,
    }));
  }

  async findOne(shopId: string, id: string, userId: string) {
    await this.shopsService.findOne(shopId, userId);

    const shift = await this.prisma.shift.findFirst({
      where: {
        shopId: shopId,
        id: id,
      },
      include: {
        orders: {
          orderBy: {
            number: 'asc',
          },
          include: {
            items: {
              select: {
                id: true,
                nameSnapshot: true,
                quantity: true,
              },
            },
          },
        },
      },
    });

    if (!shift) throw new NotFoundException('Could not find this shift');

    return shift;
  }

  // TODO think if this is even needed
  async remove(shopId: string, id: string, userId: string) {
    await this.findOne(shopId, id, userId);

    await this.prisma.shift.delete({
      where: {
        shopId: shopId,
        id: id,
      },
    });
  }
}

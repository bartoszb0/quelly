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

  async findAll(shopId: string, userId: string, page: number) {
    await this.shopsService.findOne(shopId, userId);

    const pageSize = 10;

    const [shifts, total] = await Promise.all([
      this.prisma.shift.findMany({
        where: { shopId },
        orderBy: { startedAt: 'desc' },
        include: {
          _count: {
            select: { orders: true },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.shift.count({
        where: { shopId },
      }),
    ]);

    return {
      shifts: shifts.map(({ _count, ...shift }) => ({
        ...shift,
        ordersCount: _count.orders,
      })),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(shopId: string, id: string, userId: string, cursor?: string) {
    await this.shopsService.findOne(shopId, userId);

    const pageSize = 20;

    const shift = await this.prisma.shift.findFirst({
      where: {
        shopId: shopId,
        id: id,
      },
    });

    if (!shift) throw new NotFoundException('Could not find this shift');

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          shopId: shopId,
          shiftId: shift.id,
        },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: pageSize + 1,
        ...(cursor && {
          skip: 1,
          cursor: { id: cursor },
        }),
        include: {
          items: {
            select: {
              id: true,
              nameSnapshot: true,
              quantity: true,
            },
          },
        },
      }),
      this.prisma.order.count({
        where: {
          shopId: shopId,
          shiftId: shift.id,
        },
      }),
    ]);

    const hasNextPage = orders.length > pageSize;
    const items = hasNextPage ? orders.slice(0, pageSize) : orders;

    return {
      shift,
      orders: items,
      meta: {
        pageSize,
        total,
        nextCursor: hasNextPage ? items[items.length - 1].id : null,
        hasNextPage,
      },
    };
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

import { Injectable } from '@nestjs/common';
import { OrderStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { ShopsService } from '../shops/shops.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly shopsService: ShopsService,
  ) {}

  async findAll(shopId: string, userId: string) {
    await this.shopsService.findOne(shopId, userId);

    // Independent read aggregates — run them in parallel.
    const [byStatus, topSellers, totalShifts, itemsAggregate] =
      await Promise.all([
        this.prisma.order.groupBy({
          by: ['status'],
          where: { shopId },
          _count: { _all: true },
        }),
        // Best sellers by units sold. Snapshot name (robust to renames/deletes),
        // excluding cancelled orders since those weren't really sold.
        this.prisma.orderItem.groupBy({
          by: ['nameSnapshot'],
          where: { order: { shopId, status: { not: 'CANCELLED' } } },
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 5,
        }),
        this.prisma.shift.count({ where: { shopId } }),
        this.prisma.orderItem.aggregate({
          where: { order: { shopId, status: { not: 'CANCELLED' } } },
          _sum: { quantity: true },
        }),
      ]);

    const count = (status: OrderStatus) =>
      byStatus.find((row) => row.status === status)?._count._all ?? 0;

    const cancelled = count('CANCELLED');
    const collected = count('COLLECTED');
    const total = byStatus.reduce((sum, row) => sum + row._count._all, 0);
    const nonCancelled = total - cancelled;
    const totalItemsSold = itemsAggregate._sum.quantity ?? 0;

    return {
      totalOrders: total,
      cancelledOrders: cancelled,
      collectedOrders: collected,
      completionRate: total ? collected / total : 0,
      cancellationRate: total ? cancelled / total : 0,
      totalShifts,
      avgOrdersPerShift: totalShifts ? total / totalShifts : 0,
      totalItemsSold,
      avgItemsPerOrder: nonCancelled ? totalItemsSold / nonCancelled : 0,
      topSellers: topSellers.map((row) => ({
        name: row.nameSnapshot,
        quantity: row._sum.quantity ?? 0,
      })),
    };
  }
}

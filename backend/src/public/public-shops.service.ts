import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicShopsService {
  constructor(private readonly prisma: PrismaService) {}

  async findShop(shopPublicId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: {
        publicId: shopPublicId,
      },
      select: {
        id: true,
        name: true,
        publicId: true,
      },
    });

    if (!shop) throw new NotFoundException('Could not find that shop');

    const openShift = await this.prisma.shift.findFirst({
      where: {
        shopId: shop.id,
        endedAt: null,
      },
      select: { id: true },
    });

    return {
      name: shop.name,
      publicId: shop.publicId,
      hasOpenShift: Boolean(openShift),
    };
  }
}

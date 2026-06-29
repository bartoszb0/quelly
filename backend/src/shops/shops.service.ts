import { Injectable, NotFoundException } from '@nestjs/common';
import QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@Injectable()
export class ShopsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createShopDto: CreateShopDto, userId: string) {
    return this.prisma.shop.create({
      data: {
        name: createShopDto.name,
        ownerId: userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.shop.findMany({
      where: { ownerId: userId },
    });
  }

  async findOne(id: string, userId: string) {
    const shop = await this.prisma.shop.findFirst({
      where: {
        id: id,
        ownerId: userId,
      },
    });

    if (!shop) throw new NotFoundException('Could not find this shop');

    return shop;
  }

  async getQrCode(id: string, userId: string): Promise<Buffer> {
    const shop = await this.findOne(id, userId);

    const guestUrl = `${process.env.FRONTEND_URL}/s/${shop.publicId}`;

    return QRCode.toBuffer(guestUrl, { width: 512, margin: 2 });
  }

  async update(id: string, updateShopDto: UpdateShopDto, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.shop.update({
      where: {
        id: id,
        ownerId: userId,
      },
      data: {
        name: updateShopDto.name,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.prisma.shop.delete({
      where: {
        id: id,
        ownerId: userId,
      },
    });
  }
}

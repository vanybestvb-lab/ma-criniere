import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface UpdateInventoryDto {
  stockOnHand?: number;
  stockReserved?: number;
  lowStockThreshold?: number;
}

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.inventoryLevel.findMany({
      include: {
        product: {
          select: { id: true, name: true, slug: true, price: true, currency: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findByProductId(productId: string) {
    return this.prisma.inventoryLevel.findUnique({
      where: { productId },
      include: {
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async update(productId: string, dto: UpdateInventoryDto) {
    const existing = await this.prisma.inventoryLevel.findUnique({
      where: { productId },
    });
    if (!existing) {
      return this.prisma.inventoryLevel.create({
        data: {
          productId,
          quantity: dto.stockOnHand ?? 0,
          stockReserved: dto.stockReserved ?? 0,
          alertThreshold: dto.lowStockThreshold ?? 5,
        },
        include: {
          product: { select: { id: true, name: true, slug: true } },
        },
      });
    }
    return this.prisma.inventoryLevel.update({
      where: { productId },
      data: {
        ...(dto.stockOnHand != null && { quantity: dto.stockOnHand }),
        ...(dto.stockReserved != null && { stockReserved: dto.stockReserved }),
        ...(dto.lowStockThreshold != null && { alertThreshold: dto.lowStockThreshold }),
      },
      include: {
        product: { select: { id: true, name: true, slug: true } },
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type ShipmentStatus = 'PENDING' | 'PICKED' | 'IN_TRANSIT' | 'DELIVERED';

export interface UpdateDeliveryDto {
  status?: ShipmentStatus;
  trackingCode?: string;
  address?: string;
  deliveredAt?: string;
}

@Injectable()
export class DeliveriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.shipment.findMany({
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            currency: true,
            firstName: true,
            lastName: true,
            address: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.shipment.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            items: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateDeliveryDto) {
    const data: {
      status?: ShipmentStatus;
      trackingNumber?: string;
      address?: string;
      deliveredAt?: Date;
      shippedAt?: Date;
    } = {};
    if (dto.status != null) data.status = dto.status;
    if (dto.trackingCode != null) data.trackingNumber = dto.trackingCode;
    if (dto.address != null) data.address = dto.address;
    if (dto.deliveredAt != null) data.deliveredAt = new Date(dto.deliveredAt);
    if (dto.status === 'IN_TRANSIT' || dto.status === 'PICKED') {
      data.shippedAt = new Date();
    }
    if (dto.status === 'DELIVERED') {
      data.deliveredAt = data.deliveredAt ?? new Date();
    }
    return this.prisma.shipment.update({
      where: { id },
      data,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
          },
        },
      },
    });
  }
}

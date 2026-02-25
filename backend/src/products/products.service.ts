import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateProductDto {
  name: string;
  slug: string;
  description?: string;
  price?: number;
  currency?: string;
  categoryId?: string;
  tag?: string;
  isActive?: boolean;
  images?: string[];
}

export interface UpdateProductDto {
  name?: string;
  slug?: string;
  descriptionShort?: string;
  descriptionLong?: string;
  price?: number;
  currency?: string;
  categoryId?: string;
  tag?: string;
  active?: boolean;
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      where: { active: true },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        inventory: true,
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        inventory: true,
        category: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug, active: true },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        inventory: true,
      },
    });
  }

  async create(dto: CreateProductDto) {
    const { images, ...data } = dto;
    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        descriptionShort: data.description ?? null,
        price: data.price ?? null,
        currency: data.currency ?? 'EUR',
        categoryId: data.categoryId ?? null,
        tag: data.tag ?? null,
        active: data.isActive ?? true,
      },
    });
    if (images?.length) {
      await this.prisma.productImage.createMany({
        data: images.map((url, i) => ({
          productId: product.id,
          url,
          alt: product.name,
          sortOrder: i,
        })),
      });
    }
    return this.findOne(product.id);
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name != null && { name: dto.name }),
        ...(dto.slug != null && { slug: dto.slug }),
        ...(dto.descriptionShort != null && { descriptionShort: dto.descriptionShort }),
        ...(dto.descriptionLong != null && { descriptionLong: dto.descriptionLong }),
        ...(dto.price != null && { price: dto.price }),
        ...(dto.currency != null && { currency: dto.currency }),
        ...(dto.categoryId != null && { categoryId: dto.categoryId }),
        ...(dto.tag != null && { tag: dto.tag }),
        ...(dto.active != null && { active: dto.active }),
      },
    });
    return this.findOne(id);
  }
}

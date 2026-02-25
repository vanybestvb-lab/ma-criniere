import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { InventoryModule } from './inventory/inventory.module';
import { DeliveriesModule } from './deliveries/deliveries.module';

@Module({
  imports: [PrismaModule, ProductsModule, InventoryModule, DeliveriesModule],
})
export class AppModule {}

import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { InventoryService, UpdateInventoryDto } from './inventory.service';

@Controller('admin/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Patch(':productId')
  update(@Param('productId') productId: string, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.update(productId, dto);
  }
}

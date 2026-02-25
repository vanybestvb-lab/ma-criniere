import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { DeliveriesService, UpdateDeliveryDto } from './deliveries.service';

@Controller('admin/deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get()
  findAll() {
    return this.deliveriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDeliveryDto) {
    return this.deliveriesService.update(id, dto);
  }
}

import { Module } from '@nestjs/common';
import { ShiftsModule } from '../shifts/shifts.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [ShiftsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

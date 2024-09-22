import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order_products.entity';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { ProductVariant } from 'src/products/entities';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    TypeOrmModule.forFeature([Order, OrderProduct]),
    UsersModule,
    ProductsModule
  ],
  exports: [TypeOrmModule, OrdersModule, ProductsModule]
})
export class OrdersModule {}

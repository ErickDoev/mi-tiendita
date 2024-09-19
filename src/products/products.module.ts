import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { 
  Product, 
  Variant, 
  ProductVariant, 
  Category, 
  Brand, 
  Image 
} from './entities/';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Variant,
      ProductVariant,
      Category,
      Brand,
      Image
    ]),
    UsersModule
  ],
  exports: [
    TypeOrmModule,
    ProductsModule
  ]
})
export class ProductsModule {}

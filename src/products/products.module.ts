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
  Image, 
  ProductVariantSize,
  Size
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
      ProductVariantSize,
      Category,
      Brand,
      Image,
      Size
    ])
  ],
  exports: [
    TypeOrmModule,
    ProductsService
  ]
})
export class ProductsModule {}

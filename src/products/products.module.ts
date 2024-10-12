import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { 
  Product, 
  Variant,
  Category, 
  Brand, 
  Image, 
  ProductVariantSize,
  Size,
  ProductVariant
} from './entities/';
import { UsersModule } from 'src/users/users.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Variant,
      ProductVariantSize,
      ProductVariant,
      Category,
      Brand,
      Image,
      Size
    ]),
    FilesModule
  ],
  exports: [
    TypeOrmModule,
    ProductsService,
  ]
})
export class ProductsModule {}

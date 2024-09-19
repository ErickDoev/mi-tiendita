import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gender } from './entities/gender.entity';
import { Role } from './entities/role.entity';
import { Favorite, ShoppingCart, User } from './entities';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Gender, Role, ShoppingCart, Favorite])
  ],
  exports: [TypeOrmModule, UsersModule]
})
export class UsersModule {}

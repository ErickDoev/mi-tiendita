import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateGenderDto, CreateRoleDto, UpdateCartDto } from './dto';
import { UpdateWishListDto } from './dto/update-wish-list.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id/profile')
  findProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findProfile(id);
  }

  @Get(':userId/favorites')
  findUserFavorites(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.usersService.findUserFavorites(userId);
  }

  @Delete(':userId/favorite/product/:productId/variant/:variantId/delete')
  removeUserFavorite(@Param('userId', ParseUUIDPipe)userId: string, @Param('productId', ParseUUIDPipe) productId: string, @Param('variantId', ParseUUIDPipe) variantId: string) {
    return this.usersService.removeUserFavorite(userId, productId, variantId);
  }

  @Post(':id/favorite')
  updateWishList(@Body() updateWishListDto: UpdateWishListDto) {
    return this.usersService.updateWishList(updateWishListDto);
  }

  @Post(':userId/shopping-cart')
  updateShoppingCart(@Body() updateCartDto: UpdateCartDto,  @Param('userId', ParseUUIDPipe) userId: string ) {
    return this.usersService.updateCart(updateCartDto, userId);
  }

  @Get(':userId/shopping-cart')
  findUserProductsCart(@Param('userId', ParseUUIDPipe) userId: string ) {
    return this.usersService.findUserProductsCart(userId);
  }

  @Delete(':userId/shopping-cart/:shoppinCartProduct/delete')
  removeProductCart(@Param('userId', ParseUUIDPipe)userId: string, @Param('shoppinCartProduct', ParseUUIDPipe) shoppinCartProduct: string) {
    return this.usersService.removeProductShoppingCart(userId, shoppinCartProduct);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('gender')
  createGender(@Body() createGenderDto: CreateGenderDto) {
    return this.usersService.createGender(createGenderDto);
  }

  @Get('gender')
  findAllGenders() {
    return this.usersService.findAllGenders();
  }

  @Get()
  getAllGenders() {

  }

  @Post('role')
  createRole(@Body() createRoleDto: CreateRoleDto) {
    this.usersService.createRole(createRoleDto);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  CreateBrandDto,
  CreateVariantDto,
  CreateImageDto,
  CreateSizeDto
} from './dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Post('brand')
  createBrand(@Body() createBrandDto: CreateBrandDto) {
    return this.productsService.createBrand(createBrandDto);
  }

  @Post('category')
  createCategory(@Body() createCategoryDto: CreateCategoryDto){
    return this.productsService.creeateCategory(createCategoryDto);
  }

  @Post('variant')
  createVariant(@Body() createVariantDto: CreateVariantDto) {
    return this.productsService.createVariant(createVariantDto);
  }

  // @Post('add/variant')
  // createProductVariant(
  //   @Body() createProductVariantDto: CreateProductVariantDto
  // ){
  //   return this.productsService.createProductVariant(createProductVariantDto);
  // }

  @Post(':id/add/image')
  createImageProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createImageDto: CreateImageDto
  ){
    return this.productsService.createImage(id, createImageDto);
  }

  @Post('size')
  createSize(@Body() createSizeDto: CreateSizeDto) {
    return this.productsService.createSize(createSizeDto);
  }
}

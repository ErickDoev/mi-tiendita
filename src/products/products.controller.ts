import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  CreateBrandDto,
  CreateVariantDto
} from './dto';
import { CreateCategoryDto } from './dto/create-category.sto';

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
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
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
}

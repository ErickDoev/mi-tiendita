import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 
  Brand, 
  Product, 
  Variant 
} from './entities';
import { 
  CreateProductDto, 
  CreateBrandDto, 
  UpdateProductDto 
} from './dto/';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async createBrand(createBrandDto: CreateBrandDto) {
    try {
      const brandDB = this.brandRepository.create(createBrandDto);
      return await this.brandRepository.save(brandDB);

    } catch (error) {
      throw new BadRequestException(error.detail)
    }
  }
}

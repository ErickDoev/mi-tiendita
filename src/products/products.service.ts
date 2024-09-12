import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { 
  Brand, 
  Category, 
  Image, 
  Product, 
  ProductVariant, 
  Variant 
} from './entities';
import { 
  CreateProductDto, 
  CreateBrandDto, 
  UpdateProductDto,
  CreateCategoryDto,
  CreateVariantDto,
} from './dto/';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const { brand, category, variant, images, ...rest } = createProductDto;
    const brandDB = await this.findOneBrand(brand);
    if(!brandDB) throw new NotFoundException(`Brand whit id ${ variant } not found`);

    const categoryDB = await this.findOneCategory(category);
    if(!categoryDB) throw new NotFoundException(`Category whit id ${ category } not found`);

    try {

      if(variant) {
        const variantDB = await this.findOneVariant(variant);
        if(!variantDB) throw new NotFoundException(`Variant whit id ${ variant } not found`);
      
        const productDB = this.productRepository.create({
          ...rest,
        isActive: true,
        lastUpdated: new Date(),
        brand: brandDB,
        category: categoryDB,
        });
        const savedProduct = await this.productRepository.save(productDB);

        const productVariantDB = this.productVariantRepository.create({
          product: productDB,
          variant: variantDB
        });
        await this.productVariantRepository.save(productVariantDB);

        const insertPromises = [];
        images.forEach((img) => {
          insertPromises.push(this.imageRepository.save({ 
            productVariant: productVariantDB,
            imageUrl: img
           }));
        });
        await Promise.all(insertPromises);

        return savedProduct;
      }
      
      


    } catch (error) {
      this.handleDBerrors(error);
    }
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
      this.handleDBerrors(error);
    }
  }

  async findOneBrand(id: string) {
    try {
      return await this.brandRepository.findOneBy({ brandId: id });
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async creeateCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const categoryDB = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(categoryDB);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findOneCategory(id: string) {
    try {
      return await this.categoryRepository.findOneBy({ categoryId: id });
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async createVariant(createVariantDto: CreateVariantDto) {
    try {
      const variantDB = this.variantRepository.create(createVariantDto);
      return await this.variantRepository.save(variantDB);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findOneVariant(id: string) {
    try {
      return await this.variantRepository.findOneBy({ variantId: id });
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  handleDBerrors(error: any) {
    throw new BadRequestException(error.detail)
  }
}

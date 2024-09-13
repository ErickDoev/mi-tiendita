import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import { CreateProductVariantDto } from './dto/create-product-variant.dto';

@Injectable()
export class ProductsService {

  private readonly looger = new Logger('Products');

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
    const { brand, category, variant, images, stock, ...rest } = createProductDto;
    try {
      // Buscamos si existe el brand a insertar
      const brandDB = await this.findOneBrand(brand);
      if(!brandDB) throw new NotFoundException(`Brand whit id ${ variant } not found`);
      //Buscamos si existe la category a insertar
      const categoryDB = await this.findOneCategory(category);
      if(!categoryDB) throw new NotFoundException(`Category whit id ${ category } not found`);

      let savedProduct: Product;
      //Si existe la variante la manejamos de una manera especial 
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
        savedProduct = await this.productRepository.save(productDB);

        const productVariantDB = this.productVariantRepository.create({
          product: productDB,
          variant: variantDB,
          stock: stock
        });
        await this.productVariantRepository.save(productVariantDB);

        await this.createImagesWithVariant(images, productVariantDB);

      } else {
        const createProduct = this.productRepository.create({
          ...rest,
          brand: brandDB,
          category: categoryDB,
          stock,
          isActive: true,
          lastUpdated: new Date(),
          images: images.map((img) => this.imageRepository.create({ imageUrl: img}))
        });
  
        savedProduct = await this.productRepository.save(createProduct);
      }
      
      return savedProduct; 
      
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

  async createImagesWithVariant(images: string[], productVariant: ProductVariant) {
    const insertPromises = [];
    images.forEach((img) => {
      insertPromises.push(this.imageRepository.save({ 
        productVariant: productVariant,
        imageUrl: img
       }));
    });
    await Promise.all(insertPromises);
  }

  async createProductVariant(createProductVariantDto: CreateProductVariantDto) {
    const { variant, product, images, stock } = createProductVariantDto;
    try {

      const variantDB = await this.variantRepository.findOneBy({ variantId: variant });
      if(!variantDB) throw new NotFoundException(`Variant whit id ${ variant } not found`);

      const productDB = await this.productRepository.findOneBy({ productId: product });
      if(!productDB) throw new NotFoundException(`Product whit id ${ variant } not found`);

      const createProductVariant = this.productVariantRepository.create({
        stock: +stock,
        variant: variantDB,
        product: productDB,
        images: images.map(img => this.imageRepository.create({ imageUrl: img }))
      });

      await this.productVariantRepository.save(createProductVariant);

    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  handleDBerrors(error: any) {
    this.looger.error(error);
    if(error?.response) {
      throw new BadRequestException(error.response.message);
    }
    if(error?.detail) {
      throw new BadRequestException(error.detail);
    }
    throw new BadRequestException(error);
  }
}

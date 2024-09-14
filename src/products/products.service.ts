import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
    const { brand, category, variant, images, stock, productName, ...rest } = createProductDto;
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
        product_name: productName,
        brand: brandDB,
        category: categoryDB,
        is_active: true,
        last_updated: new Date(),
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
          product_name: productName,
          brand: brandDB,
          category: categoryDB,
          stock,
          is_active: true,
          last_updated: new Date(),
          images: images.map((img) => this.imageRepository.create({ image_url: img}))
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
      const { brandName } = createBrandDto;
      const brandDB = this.brandRepository.create({
        brand_name: brandName
      });
      return await this.brandRepository.save(brandDB);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findOneBrand(id: string) {
    try {
      return await this.brandRepository.findOneBy({ brand_id: id });
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async creeateCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const { categoryName } = createCategoryDto;
      const categoryDB = this.categoryRepository.create({ category_name: categoryName });
      return await this.categoryRepository.save(categoryDB);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findOneCategory(id: string) {
    try {
      return await this.categoryRepository.findOneBy({ category_id: id });
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async createVariant(createVariantDto: CreateVariantDto) {
    try {
      const { variantName } = createVariantDto;
      const variantDB = this.variantRepository.create({ variant_name: variantName });
      return await this.variantRepository.save(variantDB);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findOneVariant(id: string) {
    try {
      return await this.variantRepository.findOneBy({ variant_id: id });
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async createImagesWithVariant(images: string[], productVariant: ProductVariant) {
    const insertPromises = [];
    images.forEach((img) => {
      insertPromises.push(this.imageRepository.save({ 
        product_variant: productVariant,
        image_url: img
       }));
    });
    await Promise.all(insertPromises);
  }

  async createProductVariant(createProductVariantDto: CreateProductVariantDto) {
    const { variant, product, images, stock } = createProductVariantDto;
    try {

      const variantDB = await this.variantRepository.findOneBy({ variant_id: variant });
      if(!variantDB) throw new NotFoundException(`Variant whit id ${ variant } not found`);

      const productDB = await this.productRepository.findOneBy({ product_id: product });
      if(!productDB) throw new NotFoundException(`Product whit id ${ variant } not found`);

      const existingProductVariant = await this.productVariantRepository.findOne({
        where: {
          product: productDB,
          variant: variantDB
        }
      });

      if(existingProductVariant) throw new ConflictException(`Product with id ${product} and variant ${variant} already exists`);
      
      const createProductVariant = this.productVariantRepository.create({
        stock: stock,
        variant: variantDB,
        product: productDB,
      });

      const productVariantDB = await this.productVariantRepository.save(createProductVariant);
      if (images && images.length > 0) {
        await this.createImagesWithVariant(images, productVariantDB);
      }
      return createProductVariant;
      
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

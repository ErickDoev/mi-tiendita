import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { 
  Brand, 
  Category, 
  Image, 
  Product, 
  ProductVariantSize, 
  // ProductVariant, 
  Size, 
  Variant 
} from './entities';
import { 
  CreateProductDto, 
  CreateBrandDto, 
  UpdateProductDto,
  CreateCategoryDto,
  CreateVariantDto,
  CreateImageDto
} from './dto/';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';

@Injectable()
export class ProductsService {

  private readonly looger = new Logger('Products');

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
    @InjectRepository(ProductVariantSize)
    private readonly productVariantSizeRepository: Repository<ProductVariantSize>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}
  async create(createProductDto: CreateProductDto) {

    const { brand, category, variant, images = [], stock, productName, size, ...rest } = createProductDto;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscamos si existe el brand a insertar
      const brandDB = await this.findOneBrand(brand);
      const categoryDB = await this.findOneCategory(category);
      const variantDB = await this.findOneVariant(variant);
      const sizeDB = await this.findOneSize(size);
      // Creamos el producto
      const createProduct = queryRunner.manager.create(Product ,{
        ...rest,
        product_name: productName,
        brand: brandDB,
        category: categoryDB,
        is_active: true,
        last_updated: new Date(),
      });
      // Cargamos el productos en base de datos
      const productDB = await queryRunner.manager.save(Product ,createProduct);
      //Buscamos si el producto ya tiene una categoria previamente cargada
      const existingProductVariantSize = await queryRunner.manager.findOne(ProductVariantSize, {
        where: {
          product: productDB,
          variant: variantDB,
          size: sizeDB
        }
      });
      // Si existe el producto con la categoria lanzamos un error
      if(existingProductVariantSize) throw new ConflictException(`Product with id ${productDB.product_id} and variant ${variant} already exists`);
      // Creamos la variante a insertar
      const createProductVariant = queryRunner.manager.create(ProductVariantSize, {
        stock: stock,
        variant: variantDB,
        product: productDB,
        size: sizeDB
      });
      // Cargamos la variante con las imagenes en BD
      const productVariantDB = await queryRunner.manager.save(ProductVariantSize, createProductVariant);

      if (images && images.length > 0) {
        for (const imageUrl of images) {
          const newImage = queryRunner.manager.create(Image, {
            image_url: imageUrl,
            product_variant: productVariantDB,
          });
          await queryRunner.manager.save(Image, newImage);
        }
      }
      // Si todo sale bien se hace el commit
      await queryRunner.commitTransaction();
      return productDB;
      
    } catch (error) {
      // sino se revierten cambios
      await queryRunner.rollbackTransaction();
      this.handleDBerrors(error);
    } finally {
      // se libera al query runner
      await queryRunner.release();
    }
  }

  async findAll() {
    const products = await this.productRepository
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.product_variant_sizes', 'pvs') // Relación con product_variants
      .innerJoinAndSelect('pvs.variant', 'v') // Relación con variants
      .innerJoinAndSelect('pvs.images','i')
      .select([
        'p.product_id', // Campos de la tabla products
        'p.product_name',
        'p.price',
        'p.description',
        'p.is_active',
        'v.variant_name', // Campos de la tabla variants
        'pvs.stock', // Campo de la tabla product_variants
        'i.image_url'
      ])
      .orderBy('p.product_id')
      .getMany();

    return products;
  }

  async findOne(id: string) {
    const products = await this.productRepository
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.product_variant_sizes', 'pvs') // Relación con product_variants
      .innerJoinAndSelect('pvs.variant', 'v') // Relación con variants
      .innerJoinAndSelect('pvs.images','i')
      .select([
        'p.product_id', // Campos de la tabla products
        'p.product_name',
        'p.price',
        'p.description',
        'p.is_active',
        'v.variant_name', // Campos de la tabla variants
        'pvs.stock', // Campo de la tabla product_variants
        'i.image_url',
        'pvs.product_variant_size_id'
      ])
      .where('p.product_id = :id', { id })
      .orderBy('p.product_id')
      .getMany();

    return products;
  }

  async findOneProduct(productId: string) {
    try {
    const product =  await this.productRepository.findOneBy({ product_id: productId });
    if(!product) throw new NotFoundException(`Product with id ${productId} not found`);
    return product;
    } catch (error) {
      this.handleDBerrors(error);
    }
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
      const brandDB = this.brandRepository.findOneBy({ brand_id: id });
      if(!brandDB) throw new NotFoundException(`Brand with id ${id} not found`);

      return brandDB;
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
      const categoryDB = await this.categoryRepository.findOneBy({ category_id: id });
      if(!categoryDB) throw new NotFoundException(`Category with id ${id} not found`);

      return categoryDB;
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
      const variant =  await this.variantRepository.findOneBy({ variant_id: id });
      if(!variant) throw new NotFoundException(`Variant with id ${id} not found`);
      return variant;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findOneSize(id: string) {
    try {
      const sizeDB =  await this.sizeRepository.findOneBy({ size_id: id });
      if(!sizeDB) throw new NotFoundException(`Size with id ${id} not found`);
      return sizeDB;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async createProductVariantSize(createProductVariantDto: CreateProductVariantDto) {
    const { variant, product, images, stock, size } = createProductVariantDto;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const variantDB = await queryRunner.manager.findOne( Variant, { where: { variant_id: variant }});
      if(!variantDB) throw new NotFoundException(`Variant whit id ${ variant } not found`);

      const productDB = await queryRunner.manager.findOne(Product, { where: { product_id: product }});
      if(!productDB) throw new NotFoundException(`Product whit id ${ variant } not found`);

      const sizeDB = await queryRunner.manager.findOne(Size, { where: { size_id: size }});
      if(!sizeDB) throw new NotFoundException(`Size whit id ${ sizeDB } not found`);

      const existingProductVariant = await queryRunner.manager.findOne(ProductVariantSize, {
        where: {
          product: productDB,
          variant: variantDB,
          size: sizeDB
        }
      });

      if(existingProductVariant) throw new ConflictException(`Product with id ${product} and variant ${variant} already exists`);
      
      const createProductVariantSize = queryRunner.manager.create(ProductVariantSize, {
        stock: stock,
        variant: variantDB,
        product: productDB,
        size: sizeDB
      });

      const productVariantDB = await queryRunner.manager.save(ProductVariantSize, createProductVariantSize);

      if (images && images.length > 0) {
        for (const imageUrl of images) {
          const newImage = queryRunner.manager.create(Image, {
            image_url: imageUrl,
            product_variant: productVariantDB,
          });
          await queryRunner.manager.save(Image, newImage);
        }
      }

      // Confirmar la transacción (commit)
      await queryRunner.commitTransaction();

      // Retornar el productVariant creado
      return productVariantDB;
      
    } catch (error) {
      // Si ocurre un error, revertir la transacción (rollback)
      await queryRunner.rollbackTransaction();
      this.handleDBerrors(error);
    } finally {
      // Liberar el queryRunner después de finalizar la transacción
      await queryRunner.release();
    }
  }

  async findOneProductVariantSize(product: Product, variant: Variant, size: Size) {
   try {
    const productVariant = await this.productVariantSizeRepository.findOne({
      where: {
        product,
        variant,
        size
      }
    });
    if(!productVariant) throw new NotFoundException(`Product with variant ${ variant } not found`);
    return productVariant;
   } catch (error) {
    this.handleDBerrors(error);
   } 
  }

  async createImage(id: string, createImageDto: CreateImageDto) {

    const { images } = createImageDto;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const productVariantSizeBD = await queryRunner.manager.findOne(ProductVariantSize, { where: { product_variant_size_id: id }});
      if(!productVariantSizeBD) throw new NotFoundException(`Product Variant whit id ${ id } not found`);

      if (images && images.length > 0) {
        for (const imageUrl of images) {
          const newImage = queryRunner.manager.create(Image, {
            image_url: imageUrl,
            product_variant: productVariantSizeBD,
          });
          await queryRunner.manager.save(Image, newImage);
        }
      }
      await queryRunner.commitTransaction();
      return productVariantSizeBD;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBerrors(error);
    } finally {
      await queryRunner.release();
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

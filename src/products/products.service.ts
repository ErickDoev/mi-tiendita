import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, QueryBuilder, QueryRunner, Repository } from 'typeorm';
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
    private readonly dataSource: DataSource,
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

    const { brand, category, variant, images = [], stock, productName, ...rest } = createProductDto;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscamos si existe el brand a insertar
      const brandDB = await this.findOneBrand(brand);
      if(!brandDB) throw new NotFoundException(`Brand whit id ${ variant } not found`);
      // Buscamos si existe la category a insertar
      const categoryDB = await this.findOneCategory(category);
      if(!categoryDB) throw new NotFoundException(`Category whit id ${ category } not found`);
      // Buscamos si existe la variante a insertar
      const variantDB = await this.findOneVariant(variant);
      if(!variantDB) throw new NotFoundException(`Variant whit id ${ variant } not found`);
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
      const existingProductVariant = await queryRunner.manager.findOne(ProductVariant, {
        where: {
          product: productDB,
          variant: variantDB
        }
      });
      // Si existe el producto con la categoria lanzamos un error
      if(existingProductVariant) throw new ConflictException(`Product with id ${productDB.product_id} and variant ${variant} already exists`);
      // Creamos la variante a insertar
      const createProductVariant = queryRunner.manager.create(ProductVariant, {
        stock: stock,
        variant: variantDB,
        product: productDB,
      });
      // Cargamos la variante con las imagenes en BD
      const productVariantDB = await queryRunner.manager.save(ProductVariant, createProductVariant);

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
      .innerJoinAndSelect('p.product_variants', 'pv') // Relación con product_variants
      .innerJoinAndSelect('pv.variant', 'v') // Relación con variants
      .innerJoinAndSelect('pv.images','i')
      .select([
        'p.product_id', // Campos de la tabla products
        'p.product_name',
        'p.price',
        'p.description',
        'p.is_active',
        'v.variant_name', // Campos de la tabla variants
        'pv.stock', // Campo de la tabla product_variants
        'i.image_url'
      ])
      .orderBy('p.product_id')
      .getMany();

    return products;
  }

  async findOne(id: string) {
    const products = await this.productRepository
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.product_variants', 'pv') // Relación con product_variants
      .innerJoinAndSelect('pv.variant', 'v') // Relación con variants
      .innerJoinAndSelect('pv.images','i')
      .select([
        'p.product_id', // Campos de la tabla products
        'p.product_name',
        'p.price',
        'p.description',
        'p.is_active',
        'v.variant_name', // Campos de la tabla variants
        'pv.stock', // Campo de la tabla product_variants
        'i.image_url'
      ])
      .where('p.product_id = :id', { id })
      .orderBy('p.product_id')
      .getMany();

    return products;
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

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const variantDB = await queryRunner.manager.findOne( Variant, { where: { variant_id: variant }});
      if(!variantDB) throw new NotFoundException(`Variant whit id ${ variant } not found`);

      const productDB = await queryRunner.manager.findOne(Product, { where: { product_id: product }});
      if(!productDB) throw new NotFoundException(`Product whit id ${ variant } not found`);

      const existingProductVariant = await queryRunner.manager.findOne(ProductVariant, {
        where: {
          product: productDB,
          variant: variantDB
        }
      });

      if(existingProductVariant) throw new ConflictException(`Product with id ${product} and variant ${variant} already exists`);
      
      const createProductVariant = queryRunner.manager.create(ProductVariant, {
        stock: stock,
        variant: variantDB,
        product: productDB,
      });

      const productVariantDB = await queryRunner.manager.save(ProductVariant, createProductVariant);

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

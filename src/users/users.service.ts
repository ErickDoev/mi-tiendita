import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateGenderDto, CreateRoleDto, UpdateCartDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite, Gender, Role, ShoppingCart, User } from './entities';
import { Repository } from 'typeorm';
import * as  bcrypt from 'bcrypt';
import { UpdateWishListDto } from './dto/update-wish-list.dto';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/entities';

@Injectable()
export class UsersService {

  private readonly looger = new Logger('Products');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Gender)
    private readonly genderRepository: Repository<Gender>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ShoppingCart)
    private readonly shoppingCartRepository: Repository<ShoppingCart>,
    private readonly producService: ProductsService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { gender, userName, firstLastName, secondLastName, phoneNumber, email, password, ...rest } = createUserDto;
    console.log(gender);
    
    try {
      const genderDB = await this.genderRepository.findOne({
        where: { gender_name: 'none' }
      });
      if(!genderDB) throw new NotFoundException(`Gender whit id ${ gender } not found`);
      console.log(genderDB);
      
      const roleDB = await this.roleRepository.findOne({
        where: { role_name: 'user' }
      });

      if(!roleDB) throw new NotFoundException(`Role whit id ${ gender } not found`);

      const createUser = this.userRepository.create({
        gender: genderDB,
        user_name: userName,
        first_last_name: firstLastName,
        second_last_name: secondLastName,
        phone_number: phoneNumber,
        last_conection: new Date(),
        is_active: true,
        email: email,
        password: bcrypt.hashSync(password, 10),
        role: roleDB,
        ...rest
      });
      const userDB = await this.userRepository.save(createUser);
      delete userDB.password;
      return userDB;
      
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findProfile(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: id },
        select: {
          user_id: true, 
          user_name: true, 
          first_last_name: true, 
          second_last_name: true,
          birthday: true,
          email: true,
          phone_number: true,
          acceptMarketing: true
        },
        relations: {
          gender: true
        }
      });
      return user;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user= await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, user_id: true },
        relations: { role: true }
      });
      return user;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async updateWishList(updateListWishDto: UpdateWishListDto) {
    const { userId, variantId, sizeId, productId } = updateListWishDto;
    try {
      const userDB = await this.findUser(userId);
      const productDB = await this.producService.findOneProduct(productId);
      const variant = await this.producService.findOneVariant(variantId);
      const size = await this.producService.findOneSize(variantId);

      const productVariantSize = await this.producService.findOneProductVariantSize(productDB, variant, size);

      const createrFavorite = this.favoriteRepository.create({
        user: userDB,
        productVariantSize
      });
      
      return this.favoriteRepository.save(createrFavorite);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async updateCart(updateCartDto: UpdateCartDto,  userId: string) {
    const { variantId, productId, quantity } = updateCartDto;
    try {
      const userDB = await this.findUser(userId);
      const productDB = await this.producService.findOneProduct(productId);
      const variantDB = await this.producService.findOneVariant(variantId);
      const sizeDB = await this.producService.findOneSize(variantId);

      const productVariantSizeDB = await this.producService.findOneProductVariantSize(productDB, variantDB, sizeDB);

      const createCartItem = this.shoppingCartRepository.create({
        user: userDB,
        productVariantSize: productVariantSizeDB,
        quantity
      });
      
      return this.shoppingCartRepository.save(createCartItem);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findUserFavorites(userId: string) {
    try {
      const products = await this.productRepository
        .createQueryBuilder('p')
        .innerJoinAndSelect('p.brand', 'b') // Relación con brands
        .innerJoinAndSelect('p.product_variants', 'pv') // Relación con product_variants
        .innerJoinAndSelect('pv.variant', 'v') // Relación con variants
        .innerJoinAndSelect('pv.favorite', 'f') // Relación con favorites
        .innerJoinAndSelect('f.user', 'u') // Relación con users a través de favorites
        .select([
          'p.product_id',       // Campos de products
          'p.product_name',
          'p.price',
          'b.brand_name',       // Campo de brands
          'v.variant_id',
          'v.variant_name',     // Campo de variants
          'pv.stock',           // Campo de product_variants
          'u.user_id',          // Campo de users
          'u.user_name'
        ])
        .where('u.user_id = :userId', { userId }) // Condición WHERE para filtrar por el user_id
        .orderBy('p.product_name')
        .getRawMany();
      
      return products;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findUserProductsCart(userId: string) {
    try {
      const products = await this.productRepository
        .createQueryBuilder('p')
        .innerJoinAndSelect('p.brand', 'b') // Relación con brands
        .innerJoinAndSelect('p.product_variants', 'pv') // Relación con product_variants
        .innerJoinAndSelect('pv.variant', 'v') // Relación con variants
        .innerJoinAndSelect('pv.shoppingCart', 's') // Relación con favorites
        .innerJoinAndSelect('s.user', 'u') // Relación con users a través de favorites
        .select([
          'p.product_id',       // Campos de products
          'p.product_name',
          'p.price',
          'b.brand_name',       // Campo de brands
          'v.variant_id',
          'v.variant_name',     // Campo de variants
          'pv.stock',           // Campo de product_variants
          'p.price'
        ])
        .where('u.user_id = :userId', { userId }) // Condición WHERE para filtrar por el user_id
        .orderBy('p.product_name')
        .getRawMany();
      
      return products;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async removeUserFavorite(userId: string, productId: string, variantId: string) {
    try {
      const userDB = await this.findUser(userId);
      const productDB = await this.producService.findOneProduct(productId);
      const variantDB = await this.producService.findOneVariant(variantId);
      const sizeDB = await this.producService.findOneSize(variantId);
      const pvs = await this.producService.findOneProductVariantSize(productDB, variantDB, sizeDB);

      const res = this.favoriteRepository.delete({ user: userDB, productVariantSize: pvs});

      return res;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async removeProductShoppingCart(userId: string, shoppinCartProduct: string) {
    try {
      const userDB = await this.findUser(userId);
      const pv = await this.shoppingCartRepository.findOneBy({ shopping_cart_id: shoppinCartProduct});
      console.log('PV :: ', pv);
      
      if(!pv) throw new NotFoundException(`Product whit id ${shoppinCartProduct} not found`);
      const res = this.shoppingCartRepository.delete({ user: userDB, shopping_cart_id: shoppinCartProduct });

      return res;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findUser(userId: string){
    try {
      const userDB = await this.userRepository.findOneBy({ user_id: userId });
      if(!userDB) throw new NotFoundException(`User whit id ${ userId } not found`);
      return userDB;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async createGender(createGenderDto: CreateGenderDto) {
    const { genderName } = createGenderDto;
    try {
      const createGender = this.genderRepository.create({
        gender_name: genderName
      });
      return await this.genderRepository.save(createGender);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findAllGenders() {
    try {
      const gendersDB = this.genderRepository.find();
      return gendersDB;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async createRole(createRoleDto: CreateRoleDto) {
    const { roleName } = createRoleDto;
    try {
      const createRole = this.roleRepository.create({ role_name: roleName });
      return await this.roleRepository.save(createRole);
    } catch (error) {
      
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

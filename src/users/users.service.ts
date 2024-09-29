import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateGenderDto, CreateRoleDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite, Gender, Role, User } from './entities';
import { Repository } from 'typeorm';
import * as  bcrypt from 'bcrypt';
import { UpdateWishListDto } from './dto/update-wish-list.dto';
import { ProductsService } from 'src/products/products.service';

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
    private readonly producService: ProductsService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { gender, userName, firstLastName, secondLastName, phoneNumber, email, password, ...rest } = createUserDto;

    try {
      const genderDB = await this.genderRepository.findOneBy({ gender_id: gender });
      if(!genderDB) throw new NotFoundException(`Gender whit id ${ gender } not found`);

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
        password: bcrypt.hashSync(password, 10 ),
        role: roleDB,
        ...rest
      });

      return await this.userRepository.save(createUser);
      
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
    const { userId, variantId, productId } = updateListWishDto;
    try {
      const userDB = await this.findUser(userId);
      const productDB = await this.producService.findOneProduct(productId);
      const variant = await this.producService.findOneVariant(variantId);
      const productVariant = await this.producService.findOneProductVariant(productDB, variant);

      const createrFavorite = this.favoriteRepository.create({
        user: userDB,
        productVariant
      });
      
      return this.favoriteRepository.save(createrFavorite);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findUserFavorites(id: string) {
    try {
      //TODO: checar y mejorar esto
      const user = await this.findUser(id);
      const favs = await this.favoriteRepository.find({
        where: {
          user
        },
        relations: {
          productVariant: true
        }
      });
      return favs;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findUser(userId: string){
    try {
      const user = await this.userRepository.findOneBy({ user_id: userId });
      if(!user) throw new NotFoundException(`User whit id ${ userId } not found`);
      return user;
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

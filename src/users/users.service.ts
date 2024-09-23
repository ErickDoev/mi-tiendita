import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateGenderDto, CreateRoleDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gender, Role, User } from './entities';
import { Repository } from 'typeorm';
import * as  bcrypt from 'bcrypt';

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
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { gender, userName, firstLastName, secondLastName, phoneNumber, email, password, ...rest } = createUserDto;

    try {
      const genderDB = await this.genderRepository.findOneBy({ gender_id: gender });
      if(!genderDB) throw new NotFoundException(`Gender whit id ${ gender } not found`);

      const roleDB = await this.roleRepository.findOneBy({ role_id: '916f79e0-4ee4-4c31-a112-11ad43ee073d' });
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
      });

      return await this.userRepository.save(createUser);
      
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
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

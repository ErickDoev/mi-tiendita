import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateCountryDto } from './dto/create-country.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address, Country, State } from './entities';
import { Repository } from 'typeorm';
import { CreateStateDto } from './dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AddressesService {

  private readonly looger = new Logger('Country');

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly userService: UsersService
  ){}

  async create(createAddressDto: CreateAddressDto) {
    const { 
      address, 
      addressExtra,
      country, 
      state, 
      city, 
      cp,
      addressPhone, 
      user
    } = createAddressDto;
    try {
      const countrDB = await this.findOneCountry(country);
      const stateDB = await this.findOneState(state);
      const userDB = await this.userService.findUser(user);
      const createAddress = this.addressRepository.create({
        address,
        address_extra: addressExtra,
        country: countrDB,
        state: stateDB,
        city,
        cp,
        address_phone: addressPhone,
        user: userDB
      });
      return await this.addressRepository.save(createAddress);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  findAll() {
    return `This action returns all addresses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address a`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }

  async createCountry(createCountryDto: CreateCountryDto) {
    try {
      const createCountry = this.countryRepository.create({country_name: createCountryDto.countryName});
      return await this.countryRepository.save(createCountry);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findOneCountry(id: string) {
    try {
      const countryDB = await this.countryRepository.findOneBy({ country_id: id });
      if(!countryDB) throw new NotFoundException(`Country with id ${ id } not found`);
      return countryDB;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findAllCountries() {
    try {
      const countryiesDB = await this.countryRepository.find();
      return countryiesDB;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async createState(createStateDto: CreateStateDto) {
    const { stateName, countryId } = createStateDto;
    try {
      const countryDB = await this.findOneCountry(countryId);
      const createState = this.stateRepository.create({
        state_name: stateName,
        country: countryDB
      });
      return await this.stateRepository.save(createState);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findOneState(id: string) {
    try {
      const stateDB = await this.stateRepository.findOneBy({ state_id: id });
      if(!stateDB) throw new NotFoundException(`State with id ${ id } not found`);
      return stateDB;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findAllStates() {
    try {
      const statesDB = await this.stateRepository.find();
      return statesDB;
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

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateCountryDto } from './dto/create-country.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class AddressesService {

  private readonly looger = new Logger('Country');

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>
  ){}

  create(createAddressDto: CreateAddressDto) {
    return 'This action adds a new address';
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
      const createCountry = this.countryRepository.create(createCountryDto);
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

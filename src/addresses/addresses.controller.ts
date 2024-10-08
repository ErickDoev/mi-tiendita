import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateCountryDto, CreateStateDto } from './dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(createAddressDto);
  }

  @Get()
  findAll() {
    return this.addressesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.update(+id, updateAddressDto);
  }

  @Post() 
  createAddredd(@Body() createAddressDto:CreateAddressDto) {
    return this.addressesService.create(createAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressesService.remove(+id);
  }

  @Post('country')
  createCountry(@Body() createCountryDto: CreateCountryDto) {
    return this.addressesService.createCountry(createCountryDto);
  }

  @Get('country/:countryId')
  findOneCountry(@Param('countryId', ParseUUIDPipe) countryId: string) {
    return this.addressesService.findOneCountry(countryId);
  }

  @Get('countries')
  findAllCountries() {
    return this.addressesService.findAllCountries();
  }

  @Post('state')
  createState(@Body() createState: CreateStateDto) {
    return this.addressesService.createState(createState);
  }

  @Get('state/:stateId')
  findOneState(@Param('stateId', ParseUUIDPipe) stateId: string) {
    return this.addressesService.findOneState(stateId);
  }

  @Get('states')
  findAllStates() {
    return this.addressesService.findAllStates();
  }

}

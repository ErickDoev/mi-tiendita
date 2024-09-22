import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address, Country, State } from './entities';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [AddressesController],
  providers: [AddressesService],
  imports: [
    TypeOrmModule.forFeature([Address, Country, State]),
    UsersModule
  ],
  exports: [TypeOrmModule, AddressesModule]
})
export class AddressesModule {}

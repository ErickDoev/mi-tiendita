import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtPayload } from './interfaces';
import { UsersService } from 'src/users/users.service';
import { LogInDto } from './dto/logIn.dto';
import * as  bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

  private readonly looger = new Logger('Products');

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ){}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      ...user,
      token: this.getJtwToken({ id: user.user_id, role: user.role.role_name }),
    }
  }

  async logIn(logInDto: LogInDto) {
    const { email, password } = logInDto;
    try {
      const user = await this.userService.findOneByEmail(email);
      if(!user) throw new NotFoundException(`User whit email ${ email } not found`);

      if(!bcrypt.compareSync(password, user.password)){
        throw new UnauthorizedException('Credentials are not valid');
      }
      delete user.password
      return {
        ...user,
        token: this.getJtwToken({id: user.user_id, role: user.role.role_id})
      }
      
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  private getJtwToken(payload: JwtPayload){
    try {
      const token = this.jwtService.sign( payload );
      return token;
    } catch (error) {
      console.log('Error :: ', error);
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

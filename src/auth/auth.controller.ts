import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @Post('signin')
  signIn(@Body() sigIn: CreateUserDto) {
    return this.userService.create(sigIn);
  }

}

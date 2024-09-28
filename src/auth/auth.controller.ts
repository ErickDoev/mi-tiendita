import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LogInDto } from './dto/logIn.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('signin')
  signIn(@Body() sigInDto: CreateUserDto) {
    return this.authService.create(sigInDto);
  }

  @Post('login')
  logIn(@Body() logInDto: LogInDto){
    return this.authService.logIn(logInDto);
  }

}

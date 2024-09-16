import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, User } from 'src/decorator/customeiz';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/user.interface';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {

    return this.authService.register(registerUserDto)
  }

  @Public()
  @Post('/login')
  handleLogin(@User() user: IUser, @Res({ passthrough: true }) response: Response) {

    return this.authService.login(user, response)
  }
}

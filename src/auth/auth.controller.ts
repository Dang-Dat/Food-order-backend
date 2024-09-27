import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, User } from 'src/decorator/customeiz';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/user.interface';
import { Response } from 'express';
import { LocalAuthGuard } from './passport/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {

    return this.authService.register(registerUserDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
    console.log(user)
    return this.authService.login(user, response)
  }
}

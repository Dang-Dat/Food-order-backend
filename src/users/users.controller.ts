import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, User } from 'src/decorator/customeiz';
import { AuthGuard } from '@nestjs/passport';
import { IUser } from './user.interface';

@Controller('my/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findOne(@User() user: IUser) {
    return this.usersService.findOne(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  update(@User() user: IUser, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

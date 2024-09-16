import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseFilePipeBuilder, UploadedFile, UseInterceptors, HttpStatus } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/decorator/customeiz';
import { IUser } from 'src/users/user.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @UseInterceptors(FileInterceptor('imageFile'))
  @UseGuards(AuthGuard('jwt'))
  @Post()
  uploadFile(
    @User() user: IUser,
    @Body() createRestaurantDto: CreateRestaurantDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^(jpg|jpeg|image\/jpeg|png|image\/png|gif|txt|pdf|application\/pdf|doc|docx|text\/plain)$/i,
        })
        .addMaxSizeValidator({
          maxSize: 10000 * 1024
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    ) file: Express.Multer.File) {
    return this.restaurantService.create(user, createRestaurantDto, file.filename);

  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  getMyRestaurant(@User() user: IUser) {
    return this.restaurantService.findOne(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('imageFile'))
  @Patch()
  update(
    @User() user: IUser,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @UploadedFile() file?: Express.Multer.File) {
    if (file) {
      // Handle file if it exists
      console.log('File received:', file);
      return this.restaurantService.update(user, updateRestaurantDto, file.filename);
    } else {
      // Handle case when file is not provided
      console.log('No file received');
      return this.restaurantService.update(user, updateRestaurantDto, null);
    }

  }

  @Delete('Order/:id')
  remove(@Param('id') id: string) {
    return this.restaurantService.remove(+id);
  }

  @Get(':id')
  getRestaurantOrders(@Param() id: string) {
    return this.restaurantService.getRestaurantOrders(id);
  }

  // @Get()
  // searchRestaurant(
  //   @Query("current") currentPage: string,
  //   @Query("pageSize") limit: string,
  //   @Query() qs: string,
  // ){
  //   return this.restaurantService.searchRestaurant(+currentPage, +limit, qs)
  // }
  @Get('search/:city')
  async searchRestaurants(
    @Param('city') city: string,
    @Query() query: any,
  ) {
    return await this.restaurantService.searchRestaurants(city, query);
  }
}


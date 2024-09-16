import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant, RestaurantDocument } from './entities/restaurant.entity';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: SoftDeleteModel<RestaurantDocument>,
  ) { }

  async create(user: IUser, createRestaurantDto: CreateRestaurantDto, file: string) {

    const isExist = await this.restaurantModel.findOne({ userId: user._id })
    if (isExist) {
      throw new BadRequestException(`Nha hang da ton tai`)
    }

    let newRestaurant = await this.restaurantModel.create({
      ...createRestaurantDto,
      userId: user._id,
      imageUrl: file,
    })
    return newRestaurant;
  }

  findAll() {
    return `This action returns all restaurant`;
  }

  async findOne(user: IUser) {
    const isExist = await this.restaurantModel.findOne({ userId: user._id })

    if (!isExist)
      throw new NotFoundException(`Nha hang khong ton tai`)

    return isExist;
  }

  async update(user: IUser, updateRestaurantDto: UpdateRestaurantDto, fileName: string) {

    const isExist = await this.restaurantModel.findOne({ userId: user._id })
    if (!isExist) {
      throw new NotFoundException(`Nha hang khong ton tai`)
    }
    if (fileName == undefined) {
      const updateRestaurant = await this.restaurantModel.updateOne(
        { userId: user._id },
        {
          ...updateRestaurantDto
        }
      )
      return updateRestaurant;
    }
    const updateRestaurant = await this.restaurantModel.updateOne(
      { userId: user._id },
      {
        ...updateRestaurantDto, imageUrl: fileName
      }
    )
    return updateRestaurant;
  }

  async getRestaurantOrders(id: string) {
    const restaurant = await this.restaurantModel.findById({ _id: id })

    if (!restaurant) {
      throw new NotFoundException("not found")
    }
    return restaurant
  }

  // async searchRestaurant(currentPage: number, limit: number, qs: string){
  //   const { filter, sort, population, projection } = aqp(qs);
  //   delete filter.current;
  //   delete filter.pageSize;

  //   let offset = (+currentPage - 1) * (+limit);
  //   let defaultLimit = +limit ? +limit : 10;

  //   const totalItems = (await this.restaurantModel.find(filter)).length;
  //   const totalPages = Math.ceil(totalItems / defaultLimit);

  //   const result = await this.restaurantModel.find(filter)
  //     .skip(offset)
  //     .limit(defaultLimit)
  //     .sort(sort as any)
  //     .populate(population)
  //     .select(projection as any)
  //     .exec();

  //   return {
  //     meta: {
  //       current: currentPage, //trang hiện tại
  //       pageSize: limit, //số lượng bản ghi đã lấy
  //       pages: totalPages, //tổng số trang với điều kiện query
  //       total: totalItems // tổng số phần tử (số bản ghi)
  //     },
  //     result //kết quả query
  //   }
  // }

  async searchRestaurants(city: string, queryParams: any) {
    const { searchQuery, selectedCuisines, sortOption = 'lastUpdated', page = 1 } = queryParams;

    let query: any = {};
    query['city'] = new RegExp(city, 'i');

    const cityCheck = await this.restaurantModel.countDocuments(query);
    if (cityCheck === 0) {
      return {
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      };
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines.split(',').map(cuisine => new RegExp(cuisine, 'i'));
      query['cuisines'] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      query['$or'] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const restaurants = await this.restaurantModel.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await this.restaurantModel.countDocuments(query);

    return {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };
  }


  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}

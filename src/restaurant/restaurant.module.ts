import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from './entities/restaurant.entity';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/files/multer.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Restaurant.name, schema: RestaurantSchema }]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    })
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService]
})
export class RestaurantModule { }

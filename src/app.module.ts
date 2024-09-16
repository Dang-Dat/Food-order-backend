import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose'
import { FilesModule } from './files/files.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { OrderModule } from './order/order.module';
import { StripeModule } from './stripe/stripe.module';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URL'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        }
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    FilesModule,
    RestaurantModule,
    OrderModule,
    StripeModule,

  ],
  controllers: [AppController],
  providers: [AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // }
  ],

})
export class AppModule { }

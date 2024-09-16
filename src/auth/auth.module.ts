import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ms from 'ms';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './passport/jwt.strategy';


@Module({
  imports: [
    UsersModule,
    PassportModule,
    //JwtModule.register({}),
    ConfigModule,
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    //     signOptions: {
    //       expiresIn: (configService.get<string>('JWT_ACCESS_EXPIRE')),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService,JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule { }

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/user.interface';
import { passportJwtSecret } from 'jwks-rsa';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private userService: UsersService,
    ) {
        super({
            // Cung cấp secretOrKeyProvider để lấy key từ JWKS
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${configService.get<string>('AUTH0_ISSUER_BASE_URL')}.well-known/jwks.json`,
            }),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: configService.get<string>('AUTH0_AUDIENCE'),
            issuer: configService.get<string>('AUTH0_ISSUER_BASE_URL'),
            algorithms: ['RS256'],
        });
    }

    async validate(payload: any) {
        const { sub } = payload;
        const user = await this.userService.getUserData(sub)


        // Trả về thông tin người dùng để được gán vào req.user
        return {
            _id: user._id,
            auth0Id: user.auth0Id,
            email: user.email
        };
    }
}
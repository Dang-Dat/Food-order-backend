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
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `https://dev-4wx7vsmaxo1217sh.us.auth0.com/.well-known/jwks.json`,
            }),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: `https://myapp.com/api`,
            issuer: `https://dev-4wx7vsmaxo1217sh.us.auth0.com/`,
            algorithms: ['RS256'],
        });
    }

    async validate(payload: any) {
        const { sub, email } = payload;
        const user = await this.userService.getUserData(sub, email)


        // Trả về thông tin người dùng để được gán vào req.user
        return {
            _id: user._id,
            auth0Id: user.auth0Id,
            email: user.email
        };
    }
}
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/user.interface';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';
import ms from 'ms';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        // private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    //ussername/ pass là 2 tham số thư viện passport nó ném về
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password);
            if (isValid === true) {
                const objUser = {
                    ...user.toObject(),
                }
                return objUser;
            }
        }

        return null;
    }

    async login(user: IUser, response: Response) {
        // const { auth0Id, email, } = user

        // const payload = {
        //     sub: "token login",
        //     iss: "from sever",
        //     auth0Id,
        //     email,

        // }
        // response.cookie("access_token", this.jwtService.sign(payload), {
        //     httpOnly: true,
        //     maxAge: ms(this.configService.get<string>("JWT_ACCESS_EXPIRE"))/1000,
        // })
        // return {
        //     access_token: this.jwtService.sign(payload),
        //     user
        // }
    }

    async register(user: RegisterUserDto) {
        let newUser = await this.usersService.register(user)
        return {
            _id: newUser?._id,
            createdAt: newUser?.createdAt
        }
    }

    // logout = async (response: Response) => {
    //     response.clearCookie("access_token")
    //     return 'ok'
    // }
}

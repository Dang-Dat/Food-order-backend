import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { use } from 'passport';
import { IUser } from './user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,

  ) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt)
    return hash;
  }

  async register(user: RegisterUserDto) {
    const { auth0Id, name, email, password, address, } = user;
    //check email
    const isExist = await this.userModel.findOne({ email: email })
    if (isExist) {
      throw new BadRequestException(`Email: ${email} da ton tai. Vui long su dung email khac`)
    }


    const hassPassword = this.getHashPassword(password);
    let newRegister = await this.userModel.create({
      auth0Id, name, email, password: hassPassword, address,
      role: "User"
    })
    return newRegister
  }


  async registerWithGG(user: RegisterUserDto) {
    const { auth0Id, name, email, password, address, } = user;
    //check email
    const isExist = await this.userModel.findOne({ email: email })
    if (isExist) {
      throw new BadRequestException(`Email: ${email} da ton tai. Vui long su dung email khac`)
    }


    const hassPassword = this.getHashPassword(password);
    let newRegister = await this.userModel.create({
      auth0Id, name, email, password: hassPassword, address,
      role: "User"
    })
    return newRegister
  }

  async findOneByUsername(email: string) {
    return this.userModel.findOne({
      email: email
    })
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash)
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne({
      $or: [
        { email: createUserDto.email },
        { auth0Id: createUserDto.auth0Id }
      ]
    });
    if (user) {
      throw new BadRequestException('Nguoi dung da ton tai');
    }

    const newUser = await this.userModel.create({
      ...createUserDto
    })
    return newUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(user: IUser) {
    const currentUser = await this.userModel.findOne({ auth0Id: user.auth0Id });

    if (!currentUser) {
      throw new NotFoundException('Nguoi dung khong ton tai');
    }
    return currentUser;
  }

  async getUserData(auth0Id: string) {
    const currentUser = await this.userModel.findOne({ auth0Id: auth0Id });

    if (!currentUser) {
      throw new NotFoundException('Nguoi dung khong ton tai');
    }
    return currentUser;
  }

  async update(user: IUser, updateUserDto: UpdateUserDto) {
    const isExist = await this.userModel.findOne({ email: updateUserDto.email })
    console.log("data",isExist)

    if (!isExist) {
      throw new NotFoundException('Nguoi dung khong ton tai');
    }

    const updated = await this.userModel.updateOne({ auth0Id: user.auth0Id },
      {
        ...updateUserDto,
      });
    return updated;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

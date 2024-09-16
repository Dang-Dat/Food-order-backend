import { IsEmail, IsNotEmpty } from "class-validator"

export class CreateUserDto {
  @IsNotEmpty({ message: "auth0Id khong duoc de trong" })
  auth0Id: string;

  @IsEmail({ message: "Email khong dung dinh dang" })
  @IsNotEmpty({ message: "Email khong duoc de trong" })
  email: string

  // @IsNotEmpty({ message: "Password khong duoc de trong" })
  password: string

  name: string

  //  @IsNotEmpty({ message: "Address khong duoc de trong" })
  address: string

  //  @IsNotEmpty({ message: "city khong duoc de trong" })
  city: string;

  //  @IsNotEmpty({ message: "country khong duoc de trong" })
  country: string;

}


export class RegisterUserDto {
  @IsNotEmpty({ message: "auth0Id khong duoc de trong" })
  auth0Id: string;

  @IsEmail({ message: "Email khong dung dinh dang" })
  @IsNotEmpty({ message: "Email khong duoc de trong" })
  email: string

  // @IsNotEmpty({ message: "Password khong duoc de trong" })
  password: string

  @IsNotEmpty({ message: "Name khong duoc de trong" })
  name: string

  //  @IsNotEmpty({ message: "Address khong duoc de trong" })
  address: string

  //  @IsNotEmpty({ message: "city khong duoc de trong" })
  city: string;

  //  @IsNotEmpty({ message: "country khong duoc de trong" })
  country: string;
}
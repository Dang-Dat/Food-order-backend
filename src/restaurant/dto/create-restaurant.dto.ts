import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export class CreateMenuItemDto {
    // @IsString()
    // @IsNotEmpty()
    // name: string;

    // @IsNumber()
    // @IsNotEmpty()
    // price: number;
}

export class CreateRestaurantDto {
    userId: string

    // @IsString()
    // @IsNotEmpty()
    // restaurantName: string;

    // @IsString()
    // @IsNotEmpty()
    // city: string;

    // @IsString()
    // @IsNotEmpty()
    // country: string;

    // @IsNumber()
    // @IsNotEmpty()
    // deliveryPrice: number;

    // @IsNumber()
    // @IsNotEmpty()
    // estimatedDeliveryTime: number;

    // @IsArray()
    // @IsString({ each: true })
    // @IsNotEmpty()
    // cuisines: string[];

    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => CreateMenuItemDto)
    // menuItems: CreateMenuItemDto[];

    // // @IsString()
    // //@IsNotEmpty()
    // imageUrl: string;
}

import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DeliveryDetailsDTO {
    @IsString()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    addressLine1: string;
  
    @IsString()
    @IsNotEmpty()
    city: string;
  }
  
  class CartItemDTO {
    @IsString()
    @IsNotEmpty()
    menuItemId: string;
  
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
  
    @IsString()
    @IsNotEmpty()
    name: string;
  }
  
  export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    restaurant: string;
  
    @IsString()
    @IsNotEmpty()
    user: string;
  
    @IsObject()
    @ValidateNested()
    @Type(() => DeliveryDetailsDTO)
    deliveryDetails: DeliveryDetailsDTO;
  
    @ValidateNested({ each: true })
    @Type(() => CartItemDTO)
    cartItems: CartItemDTO[];
  
    @IsNumber()
    @IsNotEmpty()
    totalAmount: number;
  
    @IsEnum(['placed', 'paid', 'inProgress', 'outForDelivery', 'delivered'])
    @IsNotEmpty()
    status: string;
  }
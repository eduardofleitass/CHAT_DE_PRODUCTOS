import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ProductDto {
  @IsString({ message: 'id debe ser texto' })
  @IsNotEmpty({ message: 'id es obligatorio' })
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber({}, { message: 'price debe ser numérico' })
  @IsPositive({ message: 'price debe ser mayor que cero' })
  price: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class CreateOrderDto {
  @IsString({ message: 'chatId debe ser texto' })
  @IsNotEmpty({ message: 'chatId es obligatorio' })
  chatId: string;

  @IsString()
  @IsNotEmpty()
  messageId: string;

  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;
}

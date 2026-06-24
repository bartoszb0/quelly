import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @IsUUID()
  declare menuItemId: string;

  @IsInt()
  @Min(1)
  declare quantity: number;
}

export class CreateOrderDto {
  @IsOptional() // optional - supports quick-add (no items)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];
}

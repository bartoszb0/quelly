import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CreateMenuItemDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(1, 32)
  declare name: string;
}

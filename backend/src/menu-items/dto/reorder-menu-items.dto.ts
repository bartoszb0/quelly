import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class ReorderMenuItemsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  declare ids: string[];
}

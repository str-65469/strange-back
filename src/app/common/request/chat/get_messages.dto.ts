import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetMessagesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lastId: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  take: number;
}

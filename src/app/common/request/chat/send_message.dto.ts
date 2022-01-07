import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  chatHeadId: number;

  @IsNotEmpty()
  partnerId: number;
}

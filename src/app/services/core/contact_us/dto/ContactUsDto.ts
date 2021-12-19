import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ContactUseMessageTypes } from 'src/app/enum/contact_us_message_type.enum';

export class ContactUsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsEnum(ContactUseMessageTypes)
  message_type: ContactUseMessageTypes;

  @IsString()
  @IsOptional()
  message?: string;
}

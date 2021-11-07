import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

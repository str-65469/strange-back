import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class SafeUserLogin {
  id: number;
  name: string;
  username: string;
  email: string;
}

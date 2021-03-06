import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LolServer } from '../../enum/lol_server.enum';

export class UserRegisterDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEnum(LolServer)
  @IsString()
  @IsNotEmpty()
  server: LolServer;

  @IsString()
  @IsNotEmpty()
  summoner_name: string;
}

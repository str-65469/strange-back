import { LolServer } from '../../../../common/enum/lol_server.enum';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

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

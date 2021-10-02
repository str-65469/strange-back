import { LolLeague } from './../../../enum/lol_league.enum';
import { LolServer } from './../../../enum/lol_server.enum';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

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

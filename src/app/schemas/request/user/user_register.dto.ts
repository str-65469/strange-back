import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SummonerAuthRequest } from '../auth/summoner_auth.request';

export class UserRegisterDto extends SummonerAuthRequest {
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
}

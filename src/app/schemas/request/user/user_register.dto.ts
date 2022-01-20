import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SummonerAuthRequestStep2 } from '../auth/summoner_auth_step_2.request';

export class UserRegisterDto extends SummonerAuthRequestStep2 {
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

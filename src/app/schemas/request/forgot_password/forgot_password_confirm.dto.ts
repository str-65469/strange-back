import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ForgotPasswordConfirmRequestDto {
    @IsNotEmpty()
    @IsString()
    new_password: string;

    @IsNotEmpty()
    @IsUUID(4) // version 4
    @IsString()
    uuid: string;
}

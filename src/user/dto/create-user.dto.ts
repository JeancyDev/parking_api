import { IsString, MinLength, IsNotEmpty } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

}

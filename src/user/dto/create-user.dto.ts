import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, IsNotEmpty, ValidateIf, IsIn, IsEnum, } from "class-validator";
import { Rol } from "../entities/user.rol";

export class CreateUserDto {

    @ApiProperty({
        type: String,
        example: 'Nombre Apellido',
        description: 'El nombre completo del usuario'
    })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({
        type: String,
        example: 'user',
        description: 'El usuario'
    })
    @IsString()
    @IsNotEmpty()
    userName: string;

    @ApiProperty({
        type: String,
        example: 'pass123',
        description: 'La contraseña del usuario'
    })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        type: Rol,
        description: 'El rol del usuario',
        example: Rol.cliente,
        required: true,
        enum: Rol
    })
    @IsString()
    @IsEnum(Rol)
    rol: Rol;
}

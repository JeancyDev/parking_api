import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, IsNotEmpty, ValidateIf, IsIn, } from "class-validator";

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
        type: String,
        description: 'El rol del usuario',
        example: 'cliente',
        required: true,
        enum: ['cliente', 'empleado', 'administrador']
    })
    @IsString()
    @IsIn(['cliente', 'empleado', 'administrador'])
    rol: string;
}

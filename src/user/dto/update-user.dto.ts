import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @ApiProperty({
        type: String,
        example: 'Nombre Apellido',
        description: 'El nombre completo del usuario',
        required: false
    })
    fullName?: string;

    @ApiProperty({
        type: String,
        example: 'user',
        description: 'El usuario',
        required: false
    })
    userName?: string;

    @ApiProperty({
        type: String,
        example: 'pass123',
        description: 'La contraseña del usuario',
        required: false
    })
    password?: string;

    @ApiProperty({
        type: String,
        description: 'El rol del usuario',
        example: 'cliente',
        required: false,
        enum: ['cliente', 'empleado', 'administrador'],
    })
    rol?: string;
}

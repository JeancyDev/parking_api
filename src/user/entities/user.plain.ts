import { ApiProperty } from "@nestjs/swagger";
import { Rol } from "./user.rol";

export class PlainUser {

    @ApiProperty({
        type: String,
        description: 'El nombre completo del usuario'
    })
    fullName: string;

    @ApiProperty({
        type: String,
        description: 'El username del usuario'
    })
    userName: string;

    @ApiProperty({
        type: Rol,
        description: 'El Rol del usuario',
        enum: Rol,
    })
    rol: Rol;
}
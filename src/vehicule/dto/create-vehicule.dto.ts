import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class CreateVehiculeDto {

    // @ApiProperty({
    //     description: 'El cliente dueño del vehiculo (usuario)',
    //     example: 'username',
    //     type: String,
    // })
    // @IsString()
    // @IsNotEmpty()
    // owner: string

    @ApiProperty({
        type: String,
        description: 'La marca del vehiculo',
        example: 'Toyota'
    })
    @IsString()
    @IsNotEmpty()
    brand: string;

    @ApiProperty({
        type: String,
        description: 'El modelo del vehiculo',
        example: 'modelo'
    })
    @IsString()
    @IsNotEmpty()
    model: string;

    @ApiProperty({
        type: String,
        description: 'La matrícula del vehiculo',
        example: 'ABC-123'
    })
    @IsString()
    @IsNotEmpty()
    registration: string;
}

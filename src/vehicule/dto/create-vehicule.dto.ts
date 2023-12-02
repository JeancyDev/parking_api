import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateVehiculeDto {

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

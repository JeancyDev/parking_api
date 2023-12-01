import { ApiProperty } from "@nestjs/swagger";

export class PlainVehicule {

    @ApiProperty({
        type: String,
        description: 'La marca del vehiculo'
    })
    brand: string;

    @ApiProperty({
        type: String,
        description: 'El modelo del vehiculo'
    })
    model: string;

    @ApiProperty({
        type: String,
        description: 'La matricula del vehiculo'
    })
    registration: string;
}
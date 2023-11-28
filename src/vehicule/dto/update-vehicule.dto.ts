import { PartialType } from '@nestjs/mapped-types';
import { CreateVehiculeDto } from './create-vehicule.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVehiculeDto extends PartialType(CreateVehiculeDto) {

    @ApiProperty({
        type: String,
        description: 'La marca del vehiculo',
        example: 'Toyota',
        required:false
    })
    brand?: string;

    @ApiProperty({
        type: String,
        description: 'El modelo del vehiculo',
        example: 'modelo',
        required:false
    })
    model?: string;

    @ApiProperty({
        description: 'El cliente dueño del vehiculo (usuario)',
        example: 'username',
        type: String,
        required:false
    })
    owner?: string;

    @ApiProperty({
        type: String,
        description: 'La matrícula del vehiculo',
        example: 'ABC-123',
        required:false
    })
    registration?: string;
}

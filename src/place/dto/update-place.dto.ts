import { PartialType } from '@nestjs/mapped-types';
import { CreatePlaceDto } from './create-place.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlaceDto extends PartialType(CreatePlaceDto) {

    @ApiProperty({
        type: String,
        description: 'El nombre de la plaza',
        example: 'Plaza 1',
    })
    name: string;
}

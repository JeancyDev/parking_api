import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator'

export class CreatePlaceDto {

    @ApiProperty({
        type: String,
        description: 'El nombre de la plaza',
        example: 'Plaza 1',
    })
    @IsString()
    @MinLength(1)
    name: string;
}

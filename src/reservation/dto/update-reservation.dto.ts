import { IsDateString, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReservationDto {

    @ApiProperty({
        type: () => Date,
        description: 'La fecha en la que quiere realizar la reserva',
    }
    )
    @IsDateString()
    dateTime: Date;

    @ApiProperty({
        type: Number,
        description: 'Las horas que desea reservar',
        default: 1,
        example: 1,
        minimum: 1
    })
    @IsInt()
    @IsPositive()
    time: number;
}

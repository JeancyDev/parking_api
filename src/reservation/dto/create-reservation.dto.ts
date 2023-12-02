import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNumber, IsPositive, Min } from "class-validator";

export class CreateReservationDto {

    @ApiProperty({
        type: () => Date,
        description: 'La fecha en la que quiere realizar la reserva',
    })
    @IsDateString()
    dateTime: Date;

    @ApiProperty({
        type: Number,
        description: 'El tiempo por el cual desea solicitar la reserva en horas',
        required: true,
        minimum: 1
    })
    @IsNumber()
    @IsInt()
    @IsPositive()
    @Min(1)
    time: number;

}

import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsInt, IsNotEmpty, IsNumber, IsObject, IsPositive, IsString, Min } from "class-validator";
import { SimpleDateDto, SimpleTimeDto } from "../../common/utils/date-manage";

export class CreateReservationDto {

    // @ApiProperty({
    //     type: String,
    //     description: 'La matricula del vehiculo',
    //     example: 'matricula',
    // })
    // @IsString()
    // @IsNotEmpty()
    // vehiculeRegistration: string;

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

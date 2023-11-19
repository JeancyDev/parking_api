import { IsDate, IsNotEmpty, IsString, MinDate } from "class-validator";

export class CreateReservationDto {

    @IsString()
    @IsNotEmpty()
    vehiculeRegistration: string;

    @IsDate()
    @MinDate(new Date())
    date: Date;
}

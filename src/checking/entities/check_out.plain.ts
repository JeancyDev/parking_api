import { ApiProperty } from "@nestjs/swagger";

export class PlainCheckOut {

    @ApiProperty({ type: Number })
    reservationId: number;

    @ApiProperty({ type: String })
    placeName: string;

    @ApiProperty({ type: String })
    vehiculeRegistration: string;

    @ApiProperty({ type: String })
    userName: string;

    @ApiProperty({ type: Date })
    startDate: Date;

    @ApiProperty({ type: Date })
    endDate: Date;

    @ApiProperty({ type: Number })
    timeReserved: number;

    @ApiProperty({ type: Number })
    timeExtended: number;
}
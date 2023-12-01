import { ApiProperty } from "@nestjs/swagger";

export class PlainCheckIn {

    @ApiProperty({ type: String })
    placeName: string;

    @ApiProperty({ type: String })
    vehiculeRegistration: string;

    @ApiProperty({ type: String })
    userName: string;

    @ApiProperty({ type: Date })
    date: Date;

    @ApiProperty({ type: Number })
    reservationId: number;
}
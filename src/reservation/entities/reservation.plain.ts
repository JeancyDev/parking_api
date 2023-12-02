import { ApiProperty } from "@nestjs/swagger";

export class PlainReservation {

    @ApiProperty({ type: Number })
    publicId: number;

    @ApiProperty({ type: Date })
    startDate: Date;

    @ApiProperty({ type: Number })
    time: number;

    @ApiProperty({ type: String })
    vehiculeRegistration: string;

    @ApiProperty({ type: String })
    placeName: string;

    @ApiProperty({ type: String })
    userName: string;
}
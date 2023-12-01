import { ApiProperty } from "@nestjs/swagger";
import { PlainPlace } from "src/place/entities/place.plain";
import { PlainVehicule } from "src/vehicule/entities/vehicule.plain";

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
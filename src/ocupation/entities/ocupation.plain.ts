import { ApiProperty } from "@nestjs/swagger";

export class PlainOcupation {
    
    @ApiProperty({ type: String })
    placeName: string;
    
    @ApiProperty({ type: String })
    vehiculeRegistration: string;
    
    @ApiProperty({ type: String })
    userName: string;
    
    @ApiProperty({ type: String })
    startDate: Date;

    @ApiProperty({ type: Number })
    time: number;
}
import { ApiProperty } from "@nestjs/swagger";
import { TypeLog } from "./type.log";

export class PlainLog {

    @ApiProperty({ enum: TypeLog })
    type: TypeLog;

    @ApiProperty({ type: String })
    userName: string;
    
    @ApiProperty({ type: Number })
    reservationId: number;
    
    @ApiProperty({ type: Date })
    date: Date;
}
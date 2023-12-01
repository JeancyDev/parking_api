import { ApiProperty } from "@nestjs/swagger";

export class PlainPlace {
    @ApiProperty({ type: String })
    name: string;
}
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class FindOcupationDto {

    @ApiProperty({
        required: false,
        type: Number
    })
    @IsOptional()
    reservationId?: number;

    @ApiProperty({
        required: false,
        type: String
    })
    @IsOptional()
    vehiculeRegistration?: string;
    
    @ApiProperty({
        required: false,
        type: String
    })
    @IsOptional()
    userName?: string;
    
    @ApiProperty({
        required: false,
        type: String
    })
    @IsOptional()
    placeName?: string;
}
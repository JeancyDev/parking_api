import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SigInDto {
    
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    userName: string;
    
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    password: string;
}
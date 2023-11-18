import { IsEmpty, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateVehiculeDto {

    @IsUUID('4')
    owner: string

    @IsString()
    @IsNotEmpty()
    mark: string;

    @IsString()
    @IsNotEmpty()
    model: string;

    @IsString()
    @IsNotEmpty()
    registration: string;
}

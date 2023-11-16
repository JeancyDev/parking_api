import { IsString, MinLength } from 'class-validator'

export class CreatePlaceDto {
    
    @IsString({message:'El nombre de la plaza debe ser un texto'})
    @MinLength(1,{message:'El nombre de la plaza no debe estar vacio'})
    name:string;
}

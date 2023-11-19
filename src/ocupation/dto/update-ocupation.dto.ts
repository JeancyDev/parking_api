import { PartialType } from '@nestjs/mapped-types';
import { CreateOcupationDto } from './create-ocupation.dto';

export class UpdateOcupationDto extends PartialType(CreateOcupationDto) {}

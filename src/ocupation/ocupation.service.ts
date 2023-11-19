import { Injectable } from '@nestjs/common';
import { CreateOcupationDto } from './dto/create-ocupation.dto';
import { UpdateOcupationDto } from './dto/update-ocupation.dto';

@Injectable()
export class OcupationService {
  create(createOcupationDto: CreateOcupationDto) {
    return 'This action adds a new ocupation';
  }

  findAll() {
    return `This action returns all ocupation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ocupation`;
  }

  update(id: number, updateOcupationDto: UpdateOcupationDto) {
    return `This action updates a #${id} ocupation`;
  }

  remove(id: number) {
    return `This action removes a #${id} ocupation`;
  }
}

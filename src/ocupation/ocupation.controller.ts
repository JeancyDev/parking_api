import { Controller, Get, Param } from '@nestjs/common';
import { OcupationService } from './ocupation.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ocupation')
@Controller('ocupation')
export class OcupationController {
  constructor(private readonly ocupationService: OcupationService) { }
  
  @Get()
  findAll() {
    return this.ocupationService.findAllPlain();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ocupationService.findOnePlain(id);
  }
}

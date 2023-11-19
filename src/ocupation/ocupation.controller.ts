import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OcupationService } from './ocupation.service';
import { CreateOcupationDto } from './dto/create-ocupation.dto';
import { UpdateOcupationDto } from './dto/update-ocupation.dto';

@Controller('ocupation')
export class OcupationController {
  constructor(private readonly ocupationService: OcupationService) {}

  @Post()
  create(@Body() createOcupationDto: CreateOcupationDto) {
    return this.ocupationService.create(createOcupationDto);
  }

  @Get()
  findAll() {
    return this.ocupationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ocupationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOcupationDto: UpdateOcupationDto) {
    return this.ocupationService.update(+id, updateOcupationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ocupationService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('vehicule')
@Controller('vehicule')
export class VehiculeController {
  constructor(private readonly vehiculeService: VehiculeService) { }

  @Post()
  create(@Body() createVehiculeDto: CreateVehiculeDto) {
    return this.vehiculeService.create(createVehiculeDto);
  }

  @Get()
  findAll() {
    return this.vehiculeService.findAll();
  }

  @Get(':term')
  findOne(@Param('id') term: string) {
    return this.vehiculeService.findOnePlain(term);
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updateVehiculeDto: UpdateVehiculeDto) {
    return this.vehiculeService.update(term, updateVehiculeDto);
  }

  @Delete(':term')
  remove(@Param('term') term: string) {
    return this.vehiculeService.remove(term);
  }
}

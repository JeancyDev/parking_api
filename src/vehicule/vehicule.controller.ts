import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiResponse, ApiSecurity, ApiTags, } from '@nestjs/swagger';
import { AuhtUserRol } from 'src/auth/auth.decorator';
import { Rol } from 'src/user/entities/user.rol';
import { PlainVehicule } from './entities/vehicule.plain';

@ApiSecurity('basic')
@ApiBearerAuth()
@ApiTags('vehicule')
@Controller('vehicule')
export class VehiculeController {
  constructor(private readonly vehiculeService: VehiculeService) { }

  @AuhtUserRol([Rol.cliente])
  @ApiCreatedResponse({
    description: 'Vehiculo creado',
    type: PlainVehicule
  })
  @Post()
  create(@Request() req: any, @Body() createVehiculeDto: CreateVehiculeDto) {
    return this.vehiculeService.create(req.user.userName, createVehiculeDto);
  }

  @AuhtUserRol([Rol.admin])
  @Get()
  findAll() {
    return this.vehiculeService.findAll();
  }

  @AuhtUserRol([Rol.admin])
  @Get(':registration')
  findOne(@Param('registration') registration: string) {
    return this.vehiculeService.findOnePlain(registration);
  }

  @AuhtUserRol([Rol.cliente])
  @Patch(':registration')
  update(@Request() req: any, @Param('registration') registration: string, @Body() updateVehiculeDto: UpdateVehiculeDto) {
    return this.vehiculeService.update(req.user.userName, registration, updateVehiculeDto);
  }

  @AuhtUserRol([Rol.cliente])
  @Delete(':registration')
  remove(@Request() req: any, @Param('registration') registration: string) {
    return this.vehiculeService.remove(req.user.userName, registration);
  }
}

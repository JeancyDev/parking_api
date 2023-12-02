import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse, } from '@nestjs/swagger';
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
  @ApiBadRequestResponse({ description: 'Error de llave repetida (registration)' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @Post()
  create(@Request() req: any, @Body() createVehiculeDto: CreateVehiculeDto) {
    return this.vehiculeService.create(req.user.userName, createVehiculeDto);
  }

  @AuhtUserRol([Rol.admin])
  @ApiOkResponse({
    type: PlainVehicule,
    isArray: true,
    description: 'Todos los vehiculos'
  })
  @Get()
  findAll() {
    return this.vehiculeService.findAll();
  }

  @AuhtUserRol([Rol.admin])
  @ApiOkResponse({
    type: PlainVehicule,
    description: 'Vehiculo encontrado'
  })
  @ApiBadRequestResponse({ description: 'Error de llave repetida (registration)' })
  @ApiNotFoundResponse({ description: 'Vehiculo no encontrado' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @Get(':registration')
  findOne(@Param('registration') registration: string) {
    return this.vehiculeService.findOnePlain(registration);
  }

  @AuhtUserRol([Rol.cliente])
  @ApiOkResponse({
    type: PlainVehicule,
    description: 'Vehiculo actualizado'
  })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @ApiNotFoundResponse({ description: 'Vehiculo no encontrado' })
  @ApiBadRequestResponse({ description: 'Error de llave repetida (registration)' })
  @Patch(':registration')
  update(@Request() req: any, @Param('registration') registration: string, @Body() updateVehiculeDto: UpdateVehiculeDto) {
    return this.vehiculeService.update(req.user.userName, registration, updateVehiculeDto);
  }

  @AuhtUserRol([Rol.cliente])
  @ApiOkResponse({
    type: PlainVehicule,
    description: 'Vehiculo eliminado'
  })
  @ApiNotFoundResponse({ description: 'Vehiculo no encontrado' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @Delete(':registration')
  remove(@Request() req: any, @Param('registration') registration: string) {
    return this.vehiculeService.remove(req.user.userName, registration);
  }
}

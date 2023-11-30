import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuhtUserRol } from 'src/auth/auth.decorator';
import { Rol } from 'src/user/entities/user.rol';

@ApiSecurity('basic')
@ApiBearerAuth()
@ApiTags('vehicule')
@Controller('vehicule')
export class VehiculeController {
  constructor(private readonly vehiculeService: VehiculeService) { }

  @AuhtUserRol([Rol.cliente])
  @Post()
  create(@Request() req: any, @Body() createVehiculeDto: CreateVehiculeDto) {
    return this.vehiculeService.create({ userName: req.user.userName }, createVehiculeDto);
  }

  @AuhtUserRol([Rol.admin])
  @Get()
  findAll() {
    return this.vehiculeService.findAll();
  }

  @AuhtUserRol([Rol.cliente])
  @Get(':registration')
  findOne(@Request() req: any, @Param('registration') registration: string) {
    return this.vehiculeService.findOnePlain({ registration: registration, userName: req.user.userName });
  }

  @AuhtUserRol([Rol.cliente])
  @Patch(':registration')
  update(@Request() req: any, @Param('registration') registration: string, @Body() updateVehiculeDto: UpdateVehiculeDto) {
    return this.vehiculeService.update({ registration: registration, userName: req.user.userName }, updateVehiculeDto);
  }

  @AuhtUserRol([Rol.cliente])
  @Delete(':registration')
  remove(@Request() req: any, @Param('registration') registration: string) {
    return this.vehiculeService.remove({ registration: registration, userName: req.user.userName });
  }
}

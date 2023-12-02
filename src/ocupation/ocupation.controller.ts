import { Controller, Get, Param } from '@nestjs/common';
import { OcupationService } from './ocupation.service';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuhtUserRol } from 'src/auth/auth.decorator';
import { Rol } from 'src/user/entities/user.rol';
import { PlainOcupation } from './entities/ocupation.plain';

@ApiBearerAuth()
@ApiSecurity('basic')
@ApiTags('ocupation')
@Controller('ocupation')
export class OcupationController {
  constructor(private readonly ocupationService: OcupationService) { }

  @AuhtUserRol([Rol.empleado])
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @ApiOkResponse({ type: PlainOcupation, isArray: true, description: 'Plazas ocupada' })
  @Get()
  findAll() {
    return this.ocupationService.findAllPlain();
  }

  @AuhtUserRol([Rol.empleado])
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @ApiOkResponse({ type: PlainOcupation, description: 'Plaza ocupada' })
  @ApiNotFoundResponse({ description: 'Plaza ocupada no encontrada' })
  @Get(':place')
  findOne(@Param('place') place: string) {
    return this.ocupationService.findOnePlain(place);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuhtUserRol } from 'src/auth/auth.decorator';
import { Rol } from 'src/user/entities/user.rol';
import { PlainPlace } from './entities/place.plain';

@ApiBearerAuth()
@ApiSecurity('basic')
@ApiTags('place')
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) { }

  @AuhtUserRol([Rol.admin])
  @ApiCreatedResponse({ type: PlainPlace, description: 'Plaza creada' })
  @ApiBadRequestResponse({ description: 'Llave repetida' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placeService.create(createPlaceDto);
  }

  @AuhtUserRol([Rol.admin, Rol.empleado])
  @ApiOkResponse({ type: PlainPlace, isArray: true, description: 'Todas las plazas' })
  @ApiBadRequestResponse({ description: 'Llave repetida' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @Get()
  findAll() {
    return this.placeService.findAllPlain();
  }

  @AuhtUserRol([Rol.admin, Rol.empleado])
  @ApiOkResponse({ type: PlainPlace, description: 'Plaza encontrada' })
  @ApiNotFoundResponse({ description: 'Plaza no encontrada' })
  @ApiBadRequestResponse({ description: 'Llave repetida' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @Get(':place')
  findOne(@Param('place') place: string) {
    return this.placeService.findOnePlain(place);
  }

  @AuhtUserRol([Rol.admin])
  @ApiOkResponse({ type: PlainPlace, description: 'Plaza actualizada' })
  @ApiBadRequestResponse({ description: 'Llave repetida' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placeService.update(id, updatePlaceDto);
  }

  @AuhtUserRol([Rol.admin])
  @ApiOkResponse({ type: PlainPlace, description: 'Plaza eliminada' })
  @ApiBadRequestResponse({ description: 'Llave repetida' })
  @ApiNotFoundResponse({ description: 'Plaza no encontrada' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placeService.remove(id);
  }
}

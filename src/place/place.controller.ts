import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuhtUserRol } from 'src/auth/auth.decorator';
import { Rol } from 'src/user/entities/user.rol';

@ApiBearerAuth()
@ApiSecurity('basic')
@ApiTags('place')
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) { }

  @AuhtUserRol([Rol.admin])
  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placeService.create(createPlaceDto);
  }

  @AuhtUserRol([Rol.admin, Rol.empleado])
  @Get()
  findAll() {
    return this.placeService.findAllPlain();
  }

  @AuhtUserRol([Rol.admin, Rol.empleado])
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.placeService.findOnePlain(term);
  }

  @AuhtUserRol([Rol.admin])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placeService.update(id, updatePlaceDto);
  }

  @AuhtUserRol([Rol.admin])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placeService.remove(id);
  }
}

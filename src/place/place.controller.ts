import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('place')
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) { }

  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placeService.create(createPlaceDto);
  }

  @Get()
  findAll() {
    return this.placeService.findAllPlain();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.placeService.findOnePlain(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placeService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placeService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('reservation')
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  findAll() {
    return this.reservationService.findAllPlain();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) term: number) {
    return this.reservationService.desactiveReservation(term);
  }
}

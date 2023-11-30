import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Request } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuhtUserRol } from 'src/auth/auth.decorator';
import { Rol } from 'src/user/entities/user.rol';

@ApiBearerAuth()
@ApiSecurity('basic')
@ApiTags('reservation')
@Controller('reservation')
export class ReservationController {
	constructor(private readonly reservationService: ReservationService) { }

	@AuhtUserRol([Rol.cliente])
	@Post()
	create(@Request() req, @Body() createReservationDto: CreateReservationDto) {
		return this.reservationService.create(createReservationDto, req.user);
	}

	@AuhtUserRol([Rol.cliente, Rol.admin])
	@Get()
	findAll(@Request() req) {
		return this.reservationService.findAllPlain(req.user);
	}

	@AuhtUserRol([Rol.cliente, Rol.admin])
	@Get(':id')
	findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
		return this.reservationService.findOnePlain(id, req.user);
	}

	@AuhtUserRol([Rol.cliente])
	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() updateReservationDto: UpdateReservationDto) {
		return this.reservationService.update(id, updateReservationDto);
	}

	@AuhtUserRol([Rol.cliente])
	@Delete(':id')
	remove(@Request() req, @Param('id', ParseIntPipe) term: number) {
		return this.reservationService.desactiveReservation(term);
	}
}

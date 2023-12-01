import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Request } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuhtUserRol } from 'src/auth/auth.decorator';
import { Rol } from 'src/user/entities/user.rol';
import { PlainReservation } from './entities/reservation.plain';

@ApiBearerAuth()
@ApiSecurity('basic')
@ApiTags('reservation')
@Controller('reservation')
export class ReservationController {
	constructor(private readonly reservationService: ReservationService) { }

	@AuhtUserRol([Rol.cliente])
	@ApiCreatedResponse({
		type: PlainReservation,
		description: 'Reservacion creada'
	})
	@ApiUnauthorizedResponse({ description: 'No esta autorizado' })
	@ApiBadRequestResponse({ description: 'Llave repetida' })
	@ApiNotFoundResponse({ description: 'Not found' })
	@Post()
	create(@Request() req: any, @Body() createReservationDto: CreateReservationDto) {
		return this.reservationService.create(createReservationDto, req.user.userName);
	}

	@AuhtUserRol([Rol.cliente, Rol.admin])
	@ApiOkResponse({
		type: PlainReservation,
		isArray: true,
		description: 'Todas las reservaciones'
	})
	@ApiNotFoundResponse({ description: 'Not found' })
	@ApiUnauthorizedResponse({ description: 'No esta autorizado' })
	@Get()
	findAll(@Request() req: any) {
		return this.reservationService.findAllPlain(req.user);
	}

	@AuhtUserRol([Rol.cliente, Rol.admin])
	@ApiOkResponse({
		type: PlainReservation,
		description: 'Reservacion encontrada'
	})
	@ApiNotFoundResponse({ description: 'Not found' })
	@ApiUnauthorizedResponse({ description: 'No esta autorizado' })
	@Get(':id')
	findOne(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
		return this.reservationService.findOnePlain(id, req.user);
	}

	@AuhtUserRol([Rol.cliente])
	@ApiOkResponse({
		type: PlainReservation,
		description: 'Reservacion actualizada'
	})
	@ApiNotFoundResponse({ description: 'Not found' })
	@ApiUnauthorizedResponse({ description: 'No esta autorizado' })
	@ApiBadRequestResponse({ description: 'Llave repetida' })
	@Patch(':id')
	update(@Request() req: any, @Param('id', ParseIntPipe) id: number, @Body() updateReservationDto: UpdateReservationDto) {
		return this.reservationService.update(req.user.userName, id, updateReservationDto);
	}

	@AuhtUserRol([Rol.cliente])
	@ApiOkResponse({
		type: PlainReservation,
		description: 'Reservacion eliminada'
	})
	@ApiNotFoundResponse({ description: 'Not found' })
	@ApiUnauthorizedResponse({ description: 'No esta autorizado' })
	@Delete(':id')
	remove(@Request() req: any, @Param('id', ParseIntPipe) term: number) {
		return this.reservationService.desactiveReservation(term, req.user.userName);
	}
}

import { Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import { CheckingService } from './checking.service';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuhtUserRol } from 'src/auth/auth.decorator';
import { Rol } from 'src/user/entities/user.rol';
import { PlainCheckOut } from './entities/check_out.plain';
import { PlainCheckIn } from './entities/check_in.plain';

@ApiBearerAuth()
@ApiSecurity('basic')
@ApiTags('checking')
@Controller('check')
export class CheckingController {
  constructor(private readonly checkingService: CheckingService) { }

  @AuhtUserRol([Rol.empleado])
  @ApiOkResponse({ type: PlainCheckIn, description: 'Check-in' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @ApiNotFoundResponse({ description: 'No se encuentra la reservacion' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @Post('in/:id')
  check_in(@Param('id', ParseIntPipe) reservationId: number) {
    return this.checkingService.checkIn(reservationId);
  }

  @AuhtUserRol([Rol.empleado])
  @ApiOkResponse({ type: PlainCheckOut, description: 'Check-out' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @ApiNotFoundResponse({ description: 'No se encuentra la reservacion' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @Post('out/:id')
  check_out(@Param('id', ParseIntPipe) reservationId: number) {
    return this.checkingService.checkOut(reservationId);
  }
}

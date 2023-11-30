import { Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import { CheckingService } from './checking.service';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuhtUserRol } from 'src/auth/auth.decorator';
import { Rol } from 'src/user/entities/user.rol';

@ApiBearerAuth()
@ApiSecurity('basic')
@ApiTags('checking')
@Controller('check')
export class CheckingController {
  constructor(private readonly checkingService: CheckingService) { }

  @AuhtUserRol([Rol.empleado])
  @Post('in/:id')
  check_in(@Param('id', ParseIntPipe) reservationId: number) {
    return this.checkingService.checkIn(reservationId);
  }

  @AuhtUserRol([Rol.empleado])
  @Post('out/:id')
  check_out(@Param('id', ParseIntPipe) reservationId: number) {
    return this.checkingService.checkOut(reservationId);
  }
}

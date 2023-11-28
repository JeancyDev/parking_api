import { Controller, Post, Param, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { CheckingService } from './checking.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('checking')
@Controller('check')
export class CheckingController {
  constructor(private readonly checkingService: CheckingService) { }

  @Post('in/:id')
  check_in(@Param('id', ParseIntPipe) reservationId: number) {
    return this.checkingService.checkIn(reservationId);
  }

  @Post('out/:registration')
  check_out(@Param('registration') vehiculeRegistration: string) {
    return this.checkingService.checkOut(vehiculeRegistration);
  }
}

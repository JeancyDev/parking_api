import { Module } from '@nestjs/common';
import { CheckingService } from './checking.service';
import { CheckingController } from './checking.controller';
import { OcupationModule } from 'src/ocupation/ocupation.module';
import { ReservationModule } from 'src/reservation/reservation.module';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    OcupationModule,
    ReservationModule,
    LogModule,
  ],
  controllers: [CheckingController],
  providers: [CheckingService],
})
export class CheckingModule { }

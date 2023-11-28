import { Module } from '@nestjs/common';
import { CheckingService } from './checking.service';
import { CheckingController } from './checking.controller';
import { OcupationModule } from 'src/ocupation/ocupation.module';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { ReservationModule } from 'src/reservation/reservation.module';
import { VehiculeModule } from 'src/vehicule/vehicule.module';
import { CommonModule } from 'src/common/common.module';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    OcupationModule,
    ReservationModule,
    VehiculeModule,
    LogModule,
    CommonModule
  ],
  controllers: [CheckingController],
  providers: [CheckingService],
})
export class CheckingModule { }

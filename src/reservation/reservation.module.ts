import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { CommonModule } from 'src/common/common.module';
import { VehiculeModule } from 'src/vehicule/vehicule.module';
import { PlaceModule } from 'src/place/place.module';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    CommonModule,
    VehiculeModule,
    PlaceModule,
    LogModule
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService]
})
export class ReservationModule { }

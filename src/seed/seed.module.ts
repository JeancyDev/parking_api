import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from 'src/place/entities/place.entity';
import { UserModule } from 'src/user/user.module';
import { PlaceModule } from 'src/place/place.module';
import { VehiculeModule } from 'src/vehicule/vehicule.module';
import { Vehicule } from 'src/vehicule/entities/vehicule.entity';
import { User } from 'src/user/entities/user.entity';
import { Ocupation } from 'src/ocupation/entities/ocupation.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { ReservationModule } from 'src/reservation/reservation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Place,
      Vehicule,
      User,
      Ocupation,
      Reservation
    ]),
    PlaceModule,
    UserModule,
    VehiculeModule,
    ReservationModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule { }

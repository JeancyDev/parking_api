import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from 'src/place/entities/place.entity';
import { Vehicule } from 'src/vehicule/entities/vehicule.entity';
import { User } from 'src/user/entities/user.entity';
import { Ocupation } from 'src/ocupation/entities/ocupation.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Place,
      Vehicule,
      User,
      Ocupation,
      Reservation
    ])
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule { }

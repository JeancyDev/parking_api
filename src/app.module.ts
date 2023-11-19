import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaceModule } from './place/place.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './place/entities/place.entity';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { ReservationModule } from './reservation/reservation.module';
import { VehiculeModule } from './vehicule/vehicule.module';
import { Vehicule } from './vehicule/entities/vehicule.entity';
import { CommonModule } from './common/common.module';
import { Reservation } from './reservation/entities/reservation.entity';
import { OcupationModule } from './ocupation/ocupation.module';

@Module({
  imports: [
    PlaceModule,
    TypeOrmModule.forRoot(
      {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres_user',
        password: 'postgres_password',
        database: 'parking',
        entities: [Place, User, Vehicule, Reservation],
        synchronize: true
      }),
    UserModule,
    ReservationModule,
    VehiculeModule,
    CommonModule,
    OcupationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

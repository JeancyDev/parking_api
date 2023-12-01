import { Module } from '@nestjs/common';
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
import { Ocupation } from './ocupation/entities/ocupation.entity';
import { SeedModule } from './seed/seed.module';
import { CheckingModule } from './checking/checking.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LogModule } from './log/log.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule, JwtSecret } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot(
      {
        type: 'postgres',
        host: process.env.DB_POSTGRES_HOST,
        port: parseInt(process.env.DB_POSTGRES_PORT),
        username: process.env.DB_POSTGRES_USER,
        password: process.env.DB_POSTGRES_PASSWORD,
        database: process.env.DB_POSTGRES_DB_NAME,
        entities: [Place, User, Vehicule, Reservation, Ocupation],
        synchronize: true
      }),
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_MONGO_HOST}:${process.env.DB_MONGO_PORT}/${process.env.DB_MONGO_DB_NAME}`,
    ),
    OcupationModule,
    PlaceModule,
    UserModule,
    ReservationModule,
    VehiculeModule,
    CommonModule,
    SeedModule,
    CheckingModule,
    LogModule,
    AuthModule
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard
  }
  ]
})
export class AppModule { }
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaceModule } from './place/place.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './place/entities/place.entity';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { ReservationModule } from './reservation/reservation.module';

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
        entities: [Place, User],
        synchronize: true
      }),
    UserModule,
    ReservationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

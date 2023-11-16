import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaceModule } from './place/place.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './place/entities/place.entity';

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
        entities: [Place],
        synchronize: true
      })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

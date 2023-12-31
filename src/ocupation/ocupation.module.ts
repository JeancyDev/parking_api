import { Module } from '@nestjs/common';
import { OcupationService } from './ocupation.service';
import { OcupationController } from './ocupation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ocupation } from './entities/ocupation.entity';
import { CommonModule } from 'src/common/common.module';
import { PlaceModule } from 'src/place/place.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ocupation]),
    CommonModule,
    PlaceModule
  ],
  controllers: [OcupationController],
  providers: [OcupationService],
  exports: [OcupationService]
})
export class OcupationModule { }

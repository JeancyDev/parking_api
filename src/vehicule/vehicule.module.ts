import { Module } from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { VehiculeController } from './vehicule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicule } from './entities/vehicule.entity';
import { UserModule } from 'src/user/user.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicule]),
    UserModule,
    CommonModule
  ],
  controllers: [VehiculeController],
  providers: [VehiculeService],
  exports: [VehiculeService]
})
export class VehiculeModule { }

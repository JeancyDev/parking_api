import { Module } from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { VehiculeController } from './vehicule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicule } from './entities/vehicule.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicule]),
    UserModule
  ],
  controllers: [VehiculeController],
  providers: [VehiculeService],
  exports: [VehiculeService]
})
export class VehiculeModule { }

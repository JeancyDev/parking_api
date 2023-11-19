import { Module } from '@nestjs/common';
import { OcupationService } from './ocupation.service';
import { OcupationController } from './ocupation.controller';

@Module({
  controllers: [OcupationController],
  providers: [OcupationService],
})
export class OcupationModule {}

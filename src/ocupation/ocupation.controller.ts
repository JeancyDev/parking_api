import { Body, Controller, Get, Param, Request, Query, ParseIntPipe } from '@nestjs/common';
import { OcupationService } from './ocupation.service';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuhtUserRol } from 'src/auth/auth.decorator';
import { Rol } from 'src/user/entities/user.rol';
import { FindOcupationDto } from './dto/find-ocupation.dto';

@ApiBearerAuth()
@ApiSecurity('basic')
@ApiTags('ocupation')
@Controller('ocupation')
export class OcupationController {
  constructor(private readonly ocupationService: OcupationService) { }

  @AuhtUserRol([Rol.empleado])
  @Get()
  findOne(@Query() findOption: FindOcupationDto) {
    return this.ocupationService.find(findOption);
  }
}

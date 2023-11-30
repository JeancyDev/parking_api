import { Controller, Get, Param } from '@nestjs/common';
import { LogService } from './log.service';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuhtUserRol } from 'src/auth/auth.decorator';
import { Rol } from 'src/user/entities/user.rol';

@ApiBearerAuth()
@ApiSecurity('basic')
@ApiTags('log')
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) { }

  @AuhtUserRol([Rol.admin])
  @Get()
  findAll() {
    return this.logService.findAll();
  }

}

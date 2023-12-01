import { Controller, Get, Param } from '@nestjs/common';
import { LogService } from './log.service';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuhtUserRol } from 'src/auth/auth.decorator';
import { Rol } from 'src/user/entities/user.rol';
import { PlainLog } from './entities/log.plain';
import { TypeLog } from './entities/type.log';

@ApiBearerAuth()
@ApiSecurity('basic')
@ApiTags('log')
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) { }

  @AuhtUserRol([Rol.admin])
  @ApiOkResponse({ type: PlainLog, isArray: true, description: 'Todos los logs' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @Get()
  findAll() {
    return this.logService.findAll();
  }

  @AuhtUserRol([Rol.admin])
  @ApiOkResponse({ type: PlainLog, isArray: true, description: 'Todos los logs de un tipo' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @ApiParam({ name: 'type', enum: TypeLog })
  @Get(':type')
  findAllType(@Param('type') type: TypeLog) {
    return this.logService.findAllType(type);
  }
}

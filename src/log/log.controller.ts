import { Controller, Get, Param } from '@nestjs/common';
import { LogService } from './log.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('log')
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) { }

  @Get()
  findAll() {
    return this.logService.findAll();
  }
  
}

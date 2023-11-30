import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/auth/auth.guard';
import { AuhtUserRol } from 'src/auth/auth.decorator';
import { Rol } from './entities/user.rol';


@ApiBearerAuth()
@ApiSecurity('basic')
@ApiTags('user')
@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @AuhtUserRol([Rol.admin])
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @AuhtUserRol([Rol.admin])
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @AuhtUserRol([Rol.admin])
  @Get(':user')
  findOne(@Param('user') userName: string) {
    return this.userService.findOnePlain(userName);
  }

  @AuhtUserRol([Rol.admin])
  @Patch(':user')
  update(@Param('user') userName: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userName, updateUserDto);
  }

  @AuhtUserRol([Rol.admin])
  @Delete(':user')
  remove(@Param('user') userName: string) {
    return this.userService.remove(userName);
  }
}
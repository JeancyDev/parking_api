import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { AuhtUserRol } from 'src/auth/auth.decorator';
import { Rol } from './entities/user.rol';
import { PlainUser } from './entities/user.plain';


@ApiBearerAuth()
@ApiSecurity('basic')
@ApiTags('user')
@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @AuhtUserRol([Rol.admin])
  @ApiCreatedResponse({
    description: 'Usuario Creado',
    type: PlainUser,
  })
  @ApiBadRequestResponse({ description: 'El usuario ya existe' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @AuhtUserRol([Rol.admin])
  @ApiOkResponse({
    description: 'Todos los usuarios',
    type: PlainUser,
    isArray: true
  })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @Get()
  findAll() {
    return this.userService.findAllPlain();
  }

  @AuhtUserRol([Rol.admin])
  @ApiOkResponse({
    description: 'Usuario encontrado',
    type: PlainUser,
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @Get(':user')
  findOne(@Param('user') userName: string) {
    return this.userService.findOnePlain(userName);
  }

  @AuhtUserRol([Rol.admin])
  @ApiOkResponse({
    type: PlainUser,
    description: 'Usuario actualizado'
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @Patch(':user')
  update(@Param('user') userName: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userName, updateUserDto);
  }

  @AuhtUserRol([Rol.admin])
  @ApiOkResponse({
    type: PlainUser,
    description: 'Usuario eliminado',
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiUnauthorizedResponse({ description: 'No esta autorizado' })
  @Delete(':user')
  remove(@Param('user') userName: string) {
    return this.userService.remove(userName);
  }
}
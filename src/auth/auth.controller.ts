import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigInDto } from './dto/sigIn.dto';
import { ApiTags, ApiOkResponse, ApiBadRequestResponse, } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOkResponse({ type: String, description: 'Usuario Logeado, Jwt obtenido' })
    @ApiBadRequestResponse({description:'Usuario o contraseña incorrecto'})
    @Post('login')
    login(@Body() sigIn: SigInDto) {
        return this.authService.signIn(sigIn);
    }
}
